<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePositions } from '~/composables/positions/usePositions'

const props = withDefaults(defineProps<{
  modelValue: boolean
  position?: Record<string, any> | null
}>(), {
  position: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const { createPosition, updatePosition, error } = usePositions()

const saving = ref(false)
const name = ref('')
const description = ref('')

const isEditing = () => !!props.position?.id

const resetForm = () => {
  if (props.position?.id) {
    name.value = props.position.name ?? ''
    description.value = props.position.description ?? ''
  } else {
    name.value = ''
    description.value = ''
  }
}

const submit = async () => {
  if (!name.value?.trim()) return
  saving.value = true
  try {
    let success: boolean
    if (isEditing()) {
      success = await updatePosition(props.position!.id, {
        name: name.value.trim(),
        description: description.value.trim(),
      })
    } else {
      success = await createPosition({
        name: name.value.trim(),
        description: description.value.trim(),
      })
    }
    if (success) {
      emit('saved')
      emit('update:modelValue', false)
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  resetForm()
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="500"
    @after-leave="resetForm"
  >
    <v-card>
      <v-card-title>
        {{ isEditing() ? 'Edit Position' : 'New Position' }}
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" class="mb-4" closable>
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="name"
            label="Position Name"
            required
            :rules="[(v: string) => !!v?.trim() || 'Position name is required']"
          />

          <v-textarea
            v-model="description"
            label="Description"
            rows="3"
          />
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
          :disabled="!name?.trim()"
          @click="submit"
        >
          {{ isEditing() ? 'Save' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>