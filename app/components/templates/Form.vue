<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useEvaluationTemplates } from '~/composables/templates/useEvaluationTemplates'

let idCounter = 0
const uid = () => `tmp_${++idCounter}_${Date.now()}`

const props = withDefaults(defineProps<{
  modelValue: boolean
  template?: Record<string, any> | null
}>(), {
  template: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const { createTemplate, updateTemplate, error } = useEvaluationTemplates()
const { positions, fetchPositions } = usePositions()

const saving = ref(false)
const name = ref('')
const description = ref('')
const positionId = ref('')

interface Item {
  id: string
  description: string
  order: number
}

interface Section {
  id: string
  title: string
  description: string
  order: number
  weight: number
  items: Item[]
}

const sections = ref<Section[]>([])

const isEditing = () => !!props.template?.id

const createItem = (order: number): Item => ({
  id: uid(),
  description: '',
  order,
})

const createSection = (order: number): Section => ({
  id: uid(),
  title: '',
  description: '',
  order,
  weight: 0,
  items: [createItem(0)],
})

const addSection = () => {
  sections.value.push(createSection(sections.value.length))
  recalcWeights()
}

const removeSection = (index: number) => {
  sections.value.splice(index, 1)
  recalcWeights()
}

const moveSectionUp = (index: number) => {
  if (index <= 0) return
  const temp = sections.value[index]
  sections.value[index] = sections.value[index - 1]
  sections.value[index - 1] = temp
  recalcWeights()
}

const moveSectionDown = (index: number) => {
  if (index >= sections.value.length - 1) return
  const temp = sections.value[index]
  sections.value[index] = sections.value[index + 1]
  sections.value[index + 1] = temp
  recalcWeights()
}

const addItem = (sectionIndex: number) => {
  const section = sections.value[sectionIndex]
  section.items.push(createItem(section.items.length))
}

const removeItem = (sectionIndex: number, itemIndex: number) => {
  sections.value[sectionIndex].items.splice(itemIndex, 1)
}

const recalcWeights = () => {
  const count = sections.value.length
  if (count === 0) return

  // Equal distribution, last one adjusted to sum 100
  const baseWeight = Math.floor(100 / count)
  const remainder = 100 - baseWeight * count

  sections.value.forEach((section, i) => {
    section.weight = baseWeight + (i === count - 1 ? remainder : 0)
    section.order = i
    section.items.forEach((item, j) => {
      item.order = j
    })
  })
}

const totalWeight = computed(() => {
  return sections.value.reduce((sum, s) => sum + (s.weight || 0), 0)
})

const weightValid = computed(() => totalWeight.value === 100)

const resetForm = () => {
  if (props.template?.id) {
    name.value = props.template.name ?? ''
    description.value = props.template.description ?? ''
    positionId.value = props.template.positionId ?? ''
    const s = (props.template.sections || []) as any[]
    sections.value = s.length > 0 ? s.map((sec: any) => ({
      id: sec.id || uid(),
      title: sec.title || '',
      description: sec.description || '',
      order: sec.order ?? 0,
      weight: sec.weight ?? 0,
      items: (sec.items || []).map((item: any) => ({
        id: item.id || uid(),
        description: item.description || '',
        order: item.order ?? 0,
      })),
    })) : [createSection(0)]
  } else {
    name.value = ''
    description.value = ''
    positionId.value = ''
    sections.value = [createSection(0)]
  }
  recalcWeights()
}

const submit = async () => {
  if (!name.value?.trim() || !positionId.value || !weightValid.value) return
  saving.value = true
  try {
    const data = {
      name: name.value.trim(),
      description: description.value.trim(),
      positionId: positionId.value,
      sections: sections.value.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        order: s.order,
        weight: s.weight,
        items: s.items.map((item) => ({
          id: item.id,
          description: item.description,
          order: item.order,
        })),
      })),
    }

    let success: boolean
    if (isEditing()) {
      success = await updateTemplate(props.template!.id, data)
    } else {
      success = await createTemplate(data)
    }
    if (success) {
      emit('saved')
      emit('update:modelValue', false)
    }
  } finally {
    saving.value = false
  }
}

// Utility to camelCase display name
const sectionLabel = (w: number) => `Section (${w}%)`

onMounted(() => {
  fetchPositions(true)
  resetForm()
})

watch(() => props.modelValue, (open) => {
  if (open) {
    fetchPositions(true)
    resetForm()
  }
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="800"
    @after-leave="resetForm"
    scrollable
  >
    <v-card>
      <v-card-title>
        {{ isEditing() ? 'Edit Evaluation Template' : 'New Evaluation Template' }}
      </v-card-title>

      <v-card-text style="max-height: 70vh; overflow-y: auto;">
        <v-alert v-if="error" type="error" class="mb-4" closable>
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Template Name"
                required
                :rules="[(v: string) => !!v?.trim() || 'Template name is required']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="positionId"
                label="Position"
                :items="positions"
                item-title="name"
                item-value="id"
                required
                :rules="[(v: string) => !!v || 'Position is required']"
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="description"
            label="Description"
            rows="2"
          />

          <v-divider class="my-4" />

          <div class="d-flex align-center mb-2">
            <span class="text-body-1 font-weight-medium">Sections</span>
            <v-spacer />
            <v-chip
              size="small"
              :color="weightValid ? 'success' : 'error'"
              variant="tonal"
            >
              Total: {{ totalWeight }}%
            </v-chip>
          </div>

          <v-alert
            v-if="!weightValid && sections.length > 0"
            type="warning"
            density="compact"
            variant="tonal"
            class="mb-3"
          >
            Section weights must sum to 100%. Click "Auto-distribute" below.
          </v-alert>

          <div
            v-for="(section, sIdx) in sections"
            :key="section.id"
            class="mb-4 pa-3"
            style="border: 1px solid rgba(0,0,0,0.12); border-radius: 8px;"
          >
            <div class="d-flex align-center mb-2 ga-2">
              <v-btn
                variant="text"
                icon="mdi-chevron-up"
                size="x-small"
                :disabled="sIdx === 0"
                @click="moveSectionUp(sIdx)"
              />
              <v-btn
                variant="text"
                icon="mdi-chevron-down"
                size="x-small"
                :disabled="sIdx >= sections.length - 1"
                @click="moveSectionDown(sIdx)"
              />
              <span class="text-body-2 font-weight-bold ml-1">Section {{ sIdx + 1 }}</span>
              <v-text-field
                v-model="section.weight"
                label="Weight %"
                type="number"
                min="0"
                max="100"
                hide-details
                density="compact"
                style="max-width: 100px;"
              />
              <v-btn
                variant="text"
                icon="mdi-close"
                size="x-small"
                color="error"
                @click="removeSection(sIdx)"
              />
            </div>

            <v-text-field
              v-model="section.title"
              label="Section title"
              hide-details
              density="compact"
              class="mb-2"
            />

            <v-textarea
              v-model="section.description"
              label="Description (optional)"
              rows="1"
              hide-details
              density="compact"
              class="mb-2"
            />

            <div class="text-caption font-weight-medium mb-1 mt-2">
              Items:
            </div>

            <div
              v-for="(item, iIdx) in section.items"
              :key="item.id"
              class="d-flex align-center ga-2 mb-1"
            >
              <span class="text-caption text-grey" style="min-width: 20px;">{{ iIdx + 1 }}.</span>
              <v-text-field
                v-model="item.description"
                label="Item description"
                hide-details
                density="compact"
                class="flex-grow-1"
              />
              <v-btn
                variant="text"
                icon="mdi-close-circle-outline"
                size="x-small"
                color="error"
                @click="removeItem(sIdx, iIdx)"
              />
            </div>

            <v-btn
              variant="text"
              size="small"
              color="primary"
              prepend-icon="mdi-plus"
              class="mt-1"
              @click="addItem(sIdx)"
            >
              Add item
            </v-btn>
          </div>

          <div class="d-flex ga-2">
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-plus"
              @click="addSection"
            >
              Add Section
            </v-btn>
            <v-btn
              variant="text"
              color="secondary"
              prepend-icon="mdi-autorenew"
              @click="recalcWeights"
              :disabled="sections.length === 0"
            >
              Auto-distribute weights
            </v-btn>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="saving"
          :disabled="!name?.trim() || !positionId || !weightValid"
          @click="submit"
        >
          {{ isEditing() ? 'Save' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>