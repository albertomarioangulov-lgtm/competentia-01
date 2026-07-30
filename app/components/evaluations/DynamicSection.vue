<script setup lang="ts">
const props = defineProps<{
  section: Record<string, any>
  scores: Record<string, Record<string, number | null>>
  errors?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:score', sectionId: string, itemId: string, score: number | null): void
}>()

const niveles = [
  { valor: 1, label: '1', color: 'red', descripcion: 'Deficiente' },
  { valor: 2, label: '2', color: 'orange', descripcion: 'Regular' },
  { valor: 3, label: '3', color: 'warning', descripcion: 'Bueno' },
  { valor: 4, label: '4', color: 'light-blue', descripcion: 'Muy bueno' },
  { valor: 5, label: '5', color: 'green', descripcion: 'Excelente' },
]

const getScore = (sectionId: string, itemId: string): number | null => {
  return props.scores[sectionId]?.[itemId] ?? null
}

const setScore = (sectionId: string, itemId: string, score: number | null) => {
  emit('update:score', sectionId, itemId, score)
}
</script>

<template>
  <div class="dynamic-section mb-6">
    <div class="d-flex align-center mb-1">
      <h3 class="text-body-1 font-weight-bold">{{ section.title }}</h3>
      <v-spacer />
      <v-chip size="small" color="primary" variant="tonal">
        {{ section.weight }}%
      </v-chip>
    </div>

    <p v-if="section.description" class="text-caption text-grey mb-3">
      {{ section.description }}
    </p>

    <p class="text-caption text-grey mb-3">
      <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 Deficiente ·
      <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Regular ·
      <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Bueno ·
      <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Muy bueno ·
      <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excelente
    </p>

    <v-row>
      <v-col
        v-for="(item, idx) in section.items"
        :key="item.id"
        cols="12"
        md="6"
      >
        <div
          class="mb-1 item-text"
          :class="{ 'item-error': errors?.includes(item.id) }"
        >
          <span class="text-body-2">
            <span class="text-grey mr-1">{{ idx + 1 }}.</span>
            {{ item.description }}
          </span>
          <v-icon
            v-if="errors?.includes(item.id)"
            size="x-small"
            color="error"
            class="ml-1"
          >
            mdi-alert-circle
          </v-icon>
        </div>
        <v-chip-group
          :model-value="getScore(section.id, item.id)"
          @update:model-value="(val: any) => setScore(section.id, item.id, val ?? null)"
          column
          mandatory
        >
          <v-chip
            v-for="nivel in niveles"
            :key="nivel.label"
            :value="nivel.valor"
            :color="getScore(section.id, item.id) === nivel.valor ? nivel.color : 'grey'"
            variant="tonal"
            size="small"
            filter
          >
            {{ nivel.label }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.item-text {
  max-width: 450px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.item-error {
  background-color: rgba(255, 0, 0, 0.06);
  border-left: 3px solid rgb(255, 0, 0);
}
</style>
