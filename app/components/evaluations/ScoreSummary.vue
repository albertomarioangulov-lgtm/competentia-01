<script setup lang="ts">
defineProps<{
  puntajeHabilidades: number
  puntajeDesempeno: number
  puntajeTotal: number
}>()
</script>

<template>
  <v-card variant="outlined" class="mt-4 pa-3">
    <v-row density="comfortable" align="center">
      <v-col cols="12" sm="4">
        <div class="text-caption text-grey">Habilidades (20%)</div>
        <div class="text-h6 font-weight-bold">
          {{ puntajeHabilidades.toFixed(2) }}
        </div>
      </v-col>
      <v-col cols="12" sm="4">
        <div class="text-caption text-grey">Desempeño (50%)</div>
        <div class="text-h6 font-weight-bold">
          {{ puntajeDesempeno.toFixed(2) }}
        </div>
      </v-col>
      <v-col cols="12" sm="4">
        <div class="text-caption text-grey">Puntaje Total</div>
        <div class="text-h5 font-weight-bold text-primary">
          {{ puntajeTotal.toFixed(2) }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>