<script setup lang="ts">
import {
  METAHABILIDADES,
  BETAHABILIDADES,
  HABILIDADES_OPERATIVAS,
  HABILIDADES_INTERPERSONALES,
  HABILIDADES_DIRECTIVAS,
  CRITERIOS_DESEMPENO,
  calcularPuntajeTotal,
  type EvaluacionHabilidad,
  type EvaluacionDesempeno,
} from '~~/shared/evaluations'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { can, PERMISSIONS } = usePermissions()
const { generating, downloadPdf } = useEvaluationPdf()

const evaluation = ref<any>(null)
const loading = ref(true)
const error = ref('')

const fetchEvaluation = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`/api/evaluations/${route.params.id}`)
    if (!res.ok) throw new Error('Evaluación no encontrada')
    evaluation.value = await res.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const obtenerHabilidadesPlanas = () => {
  if (!evaluation.value?.habilidades) return []
  const result: EvaluacionHabilidad[] = []
  for (const grupo of ['metahabilidades', 'betahabilidades', 'habilidadesOperativas', 'habilidadesInterpersonales', 'habilidadesDirectivas'] as const) {
    if (evaluation.value.habilidades[grupo]) {
      result.push(...evaluation.value.habilidades[grupo])
    }
  }
  return result
}

const puntajeTotal = computed(() => {
  if (!evaluation.value) return 0
  const habilidades = obtenerHabilidadesPlanas()
  const desempeno: EvaluacionDesempeno[] = evaluation.value.desempeno ?? []
  return calcularPuntajeTotal(habilidades, desempeno)
})

const puntajeHabilidades = computed(() => {
  const habilidades = obtenerHabilidadesPlanas()
  const validos = habilidades.filter((h) => h.puntaje !== null)
  if (validos.length === 0) return 0
  const obtenido = validos.reduce((sum, h) => sum + (h.puntaje ?? 0), 0)
  return ((obtenido / (validos.length * 5)) * 20)
})

const puntajeDesempeno = computed(() => {
  const desempeno: EvaluacionDesempeno[] = evaluation.value?.desempeno ?? []
  const validos = desempeno.filter((d) => d.puntaje !== null)
  if (validos.length === 0) return 0
  const obtenido = validos.reduce((sum, d) => sum + (d.puntaje ?? 0), 0)
  return ((obtenido / (validos.length * 5)) * 50)
})

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

onMounted(fetchEvaluation)
</script>

<template>
  <div v-if="loading" class="d-flex justify-center pa-10">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <v-alert v-else-if="error" type="error" class="mb-4">
    {{ error }}
  </v-alert>

  <template v-else-if="evaluation">
    <div class="d-flex align-center mb-4 ga-2">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="navigateTo('/evaluations')"
      >
        Volver
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-file-pdf-box"
        :loading="generating"
        @click="downloadPdf(evaluation)"
      >
        Descargar PDF
      </v-btn>
    </div>

    <h2 class="text-h6 font-weight-bold mb-4">
      Evaluación de {{ evaluation.empleado?.name ?? '—' }}
    </h2>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-3 mb-4">
          <div class="text-caption text-grey">Empleado</div>
          <div class="text-body-1 font-weight-medium">{{ evaluation.empleado?.name ?? '—' }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-3 mb-4">
          <div class="text-caption text-grey">Cargo</div>
          <div class="text-body-1 font-weight-medium">{{ evaluation.cargo ?? '—' }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-3 mb-4">
          <div class="text-caption text-grey">Evaluador</div>
          <div class="text-body-1 font-weight-medium">{{ evaluation.evaluador?.name ?? '—' }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Puntajes -->
    <v-card class="pa-3 mb-4">
      <v-row density="comfortable" align="center">
        <v-col cols="12" sm="4">
          <div class="text-caption text-grey">Habilidades (20%)</div>
          <div class="text-h6 font-weight-bold">{{ puntajeHabilidades.toFixed(2) }}</div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-caption text-grey">Desempeño (50%)</div>
          <div class="text-h6 font-weight-bold">{{ puntajeDesempeno.toFixed(2) }}</div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-caption text-grey">Puntaje Total</div>
          <div class="text-h5 font-weight-bold text-primary">{{ puntajeTotal.toFixed(2) }}</div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Habilidades -->
    <h3 class="text-subtitle-1 font-weight-bold mb-2">Habilidades</h3>

    <v-table class="mb-4">
      <thead>
        <tr>
          <th>Habilidad</th>
          <th>Puntaje</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in obtenerHabilidadesPlanas()" :key="h.habilidad">
          <td>{{ h.habilidad }}</td>
          <td>
            <v-chip
              :color="h.puntaje === null ? 'grey' : h.puntaje >= 4 ? 'green' : h.puntaje >= 3 ? 'warning' : 'red'"
              size="small"
              variant="tonal"
            >
              {{ h.puntaje !== null ? h.puntaje : 'N/A' }}
            </v-chip>
          </td>
          <td class="text-caption text-grey">{{ getDescripcion(h.habilidad) }}</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Desempeño -->
    <h3 class="text-subtitle-1 font-weight-bold mb-2">Desempeño</h3>

    <v-table class="mb-4">
      <thead>
        <tr>
          <th>Criterio</th>
          <th>Puntaje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in evaluation.desempeno" :key="d.criterio">
          <td>{{ d.criterio }}</td>
          <td>
            <v-chip
              :color="d.puntaje === null ? 'grey' : d.puntaje >= 4 ? 'green' : d.puntaje >= 3 ? 'warning' : 'red'"
              size="small"
              variant="tonal"
            >
              {{ d.puntaje !== null ? d.puntaje : 'N/A' }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Recomendaciones -->
    <v-card v-if="evaluation.recomendaciones" class="pa-3 mb-4">
      <div class="text-caption text-grey">Recomendaciones</div>
      <div class="text-body-1">{{ evaluation.recomendaciones }}</div>
    </v-card>
  </template>
</template>