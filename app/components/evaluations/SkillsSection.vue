<script setup lang="ts">
import { METAHABILIDADES, BETAHABILIDADES, HABILIDADES_OPERATIVAS, HABILIDADES_INTERPERSONALES, HABILIDADES_DIRECTIVAS, NIVELES } from '~~/shared/evaluations'

const props = defineProps<{
  habilidades: { habilidad: string; puntaje: number | null }[]
  groupTitle: string
}>()

// Buscar descripción según el grupo
const getDescripcion = (nombre: string): string => {
  const todas = [
    ...METAHABILIDADES,
    ...BETAHABILIDADES,
    ...HABILIDADES_OPERATIVAS,
    ...HABILIDADES_INTERPERSONALES,
    ...HABILIDADES_DIRECTIVAS,
  ]
  const found = todas.find((h) => h.nombre === nombre)
  return found?.descripcion ?? ''
}
</script>

<template>
  <div class="mb-4">
    <h4 class="text-body-2 font-weight-bold mb-1">{{ groupTitle }}</h4>
    <v-row>
      <v-col
        v-for="(item, index) in habilidades"
        :key="index"
        cols="12"
        md="6"
      >
        <div class="d-flex align-center ga-2 mb-1">
          <span class="text-body-2 font-weight-medium" style="min-width: 130px;">{{ item.habilidad }}</span>
          <v-tooltip :text="getDescripcion(item.habilidad)" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="small" color="grey-lighten-1">
                mdi-information-outline
              </v-icon>
            </template>
          </v-tooltip>
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