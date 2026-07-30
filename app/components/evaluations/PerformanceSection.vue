<script setup lang="ts">
import { NIVELES } from '~~/shared/evaluations'

defineProps<{
  items: { criterio: string; puntaje: number | null }[]
}>()
</script>

<template>
  <div class="mb-4">
    <v-row>
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        md="6"
      >
        <div class="mb-1">
          <span class="text-body-2 font-weight-medium">{{ item.criterio }}</span>
        </div>
        <v-chip-group
          :model-value="item.puntaje"
          @update:model-value="item.puntaje = $event"
          column
          mandatory
        >
          <v-chip
            v-for="nivel in NIVELES"
            :key="nivel.label"
            :value="nivel.valor"
            :color="item.puntaje === nivel.valor ? nivel.color : 'grey'"
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