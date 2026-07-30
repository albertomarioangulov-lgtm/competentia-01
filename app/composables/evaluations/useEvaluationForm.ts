// ============================================================
// Composable para manejo del formulario de evaluación
// ============================================================
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

const initialState = () => ({
  empleadoId: '',
  cargo: '',
  habilidades: {
    metahabilidades: METAHABILIDADES.map((h) => ({ habilidad: h.nombre, puntaje: null as number | null })),
    betahabilidades: BETAHABILIDADES.map((h) => ({ habilidad: h.nombre, puntaje: null as number | null })),
    habilidadesOperativas: HABILIDADES_OPERATIVAS.map((h) => ({ habilidad: h.nombre, puntaje: null as number | null })),
    habilidadesInterpersonales: HABILIDADES_INTERPERSONALES.map((h) => ({ habilidad: h.nombre, puntaje: null as number | null })),
    habilidadesDirectivas: HABILIDADES_DIRECTIVAS.map((h) => ({ habilidad: h.nombre, puntaje: null as number | null })),
  },
  desempeno: CRITERIOS_DESEMPENO.map((c) => ({ criterio: c.nombre, puntaje: null as number | null })),
  recomendaciones: '',
})

export const useEvaluationForm = () => {
  const saving = ref(false)
  const submitError = ref('')

  const form = reactive(initialState())

  // Parser para cargar datos de una evaluación existente
  const loadEvaluation = (evaluation: Record<string, any>) => {
    form.empleadoId = evaluation.empleado?.id ?? ''
    form.cargo = evaluation.cargo ?? ''

    if (evaluation.habilidades) {
      for (const grupo of ['metahabilidades', 'betahabilidades', 'habilidadesOperativas', 'habilidadesInterpersonales', 'habilidadesDirectivas'] as const) {
        if (evaluation.habilidades[grupo]) {
          ;(form.habilidades as any)[grupo] = evaluation.habilidades[grupo].map((h: any) => ({
            habilidad: h.habilidad,
            puntaje: h.puntaje ?? null,
          }))
        }
      }
    }

    if (evaluation.desempeno) {
      form.desempeno = evaluation.desempeno.map((d: any) => ({
        criterio: d.criterio,
        puntaje: d.puntaje ?? null,
      }))
    }

    form.recomendaciones = evaluation.recomendaciones ?? ''
  }

  // Resetear formulario
  const resetForm = () => {
    Object.assign(form, initialState())
  }

  // Recolectar todas las habilidades como array plano
  const todasLasHabilidades = computed<EvaluacionHabilidad[]>(() => {
    const result: EvaluacionHabilidad[] = []
    for (const grupo of ['metahabilidades', 'betahabilidades', 'habilidadesOperativas', 'habilidadesInterpersonales', 'habilidadesDirectivas'] as const) {
      result.push(...(form.habilidades[grupo] as EvaluacionHabilidad[]))
    }
    return result
  })

  // Cálculos reactivos
  const puntajeTotal = computed(() => {
    return calcularPuntajeTotal(todasLasHabilidades.value, form.desempeno)
  })

  const puntajeHabilidades = computed(() => {
    const validos = todasLasHabilidades.value.filter((h) => h.puntaje !== null)
    if (validos.length === 0) return 0
    const obtenido = validos.reduce((sum, h) => sum + (h.puntaje ?? 0), 0)
    return ((obtenido / (validos.length * 10)) * 20)
  })

  const puntajeDesempeno = computed(() => {
    const validos = form.desempeno.filter((d) => d.puntaje !== null)
    if (validos.length === 0) return 0
    const obtenido = validos.reduce((sum, d) => sum + (d.puntaje ?? 0), 0)
    return ((obtenido / (validos.length * 10)) * 50)
  })

  // Guardar evaluación
  const saveEvaluation = async (evaluationId?: string): Promise<boolean> => {
    saving.value = true
    submitError.value = ''

    try {
      const body = {
        empleadoId: form.empleadoId,
        cargo: form.cargo,
        habilidades: form.habilidades,
        desempeno: form.desempeno,
        recomendaciones: form.recomendaciones,
      }

      let response: Response
      if (evaluationId) {
        response = await fetch(`/api/evaluations/${evaluationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        response = await fetch('/api/evaluations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || data.statusMessage || 'Error al guardar la evaluación')
      }

      return true
    } catch (err: any) {
      submitError.value = err.message || 'Error desconocido'
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    form,
    saving,
    submitError,
    puntajeTotal,
    puntajeHabilidades,
    puntajeDesempeno,
    loadEvaluation,
    resetForm,
    saveEvaluation,
  }
}