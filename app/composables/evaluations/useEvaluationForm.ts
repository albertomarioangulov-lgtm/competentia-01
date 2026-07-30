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
  templateId: null as string | null,
  positionId: null as string | null,
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

export interface DynamicScoreItem {
  itemId: string
  itemDescription: string
  score: number | null
}

export interface DynamicScoreSection {
  sectionId: string
  sectionTitle: string
  sectionWeight: number
  items: DynamicScoreItem[]
}

export const useEvaluationForm = () => {
  const saving = ref(false)
  const submitError = ref('')

  const form = reactive(initialState())

  // Template data for dynamic evaluation
  const templateSections = ref<any[]>([])
  const dynamicScores = ref<Record<string, Record<string, number | null>>>({})
  const dynamicErrors = ref<string[]>([])

  // Parser para cargar datos de una evaluación existente
  const loadEvaluation = (evaluation: Record<string, any>) => {
    form.empleadoId = evaluation.empleado?.id ?? ''
    form.cargo = evaluation.cargo ?? ''
    form.templateId = evaluation.templateId ?? null
    form.positionId = evaluation.positionId ?? null

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

    // Load dynamic scores if present
    if (evaluation.dynamicScores?.length) {
      const scores: Record<string, Record<string, number | null>> = {}
      for (const section of evaluation.dynamicScores) {
        scores[section.sectionId] = {}
        for (const item of section.items) {
          scores[section.sectionId][item.itemId] = item.score ?? null
        }
      }
      dynamicScores.value = scores
    }
  }

  // Load template for a given positionId
  const loadTemplateForPosition = async (positionId: string) => {
    try {
      const template: any = await $fetch(`/api/evaluation-templates/by-position/${positionId}`)
      if (!template) {
        templateSections.value = []
        form.templateId = null
        return
      }

      form.templateId = template.id
      form.positionId = template.positionId
      form.cargo = template.positionName || ''
      templateSections.value = template.sections || []

      // Initialize scores for all items
      const scores: Record<string, Record<string, number | null>> = {}
      for (const section of templateSections.value) {
        scores[section.id] = {}
        for (const item of section.items) {
          scores[section.id][item.id] = null
        }
      }
      dynamicScores.value = scores
    } catch {
      templateSections.value = []
    }
  }

  // Update score for an item and remove error if answered
  const updateScore = (sectionId: string, itemId: string, score: number | null) => {
    if (!dynamicScores.value[sectionId]) {
      dynamicScores.value[sectionId] = {}
    }
    dynamicScores.value[sectionId][itemId] = score

    // If score is assigned, remove from errors immediately
    if (score !== null && dynamicErrors.value.includes(itemId)) {
      dynamicErrors.value = dynamicErrors.value.filter((id) => id !== itemId)
    }
  }

  // Validate all dynamic items have scores
  const validateDynamicScores = (): boolean => {
    const errors: string[] = []
    for (const section of templateSections.value) {
      for (const item of section.items) {
        const score = dynamicScores.value[section.id]?.[item.id]
        if (score === null || score === undefined) {
          errors.push(item.id)
        }
      }
    }
    dynamicErrors.value = errors
    return errors.length === 0
  }

  const hasDynamicErrors = computed(() => dynamicErrors.value.length > 0)

  const firstErrorSectionId = computed(() => {
    if (dynamicErrors.value.length === 0) return null
    for (const section of templateSections.value) {
      for (const item of section.items) {
        if (dynamicErrors.value.includes(item.id)) {
          return section.id
        }
      }
    }
    return null
  })

  // Calculate section weighted scores
  const sectionScores = computed(() => {
    const result: Array<{ sectionId: string; sectionTitle: string; weight: number; average: number; score: number; total: number; answered: number }> = []
    for (const section of templateSections.value) {
      const scores = dynamicScores.value[section.id] || {}
      const items = section.items || []
      let sum = 0
      let count = 0
      for (const item of items) {
        const score = scores[item.id]
        if (score !== null && score !== undefined) {
          sum += score
          count++
        }
      }
      const average = count > 0 ? sum / count : 0
      const score = (average / 5) * (section.weight || 0)
      result.push({
        sectionId: section.id,
        sectionTitle: section.title,
        weight: section.weight || 0,
        average,
        score,
        total: section.weight || 0,
        answered: count,
      })
    }
    return result
  })

  const dynamicPuntajeTotal = computed(() => {
    return sectionScores.value.reduce((sum, s) => sum + s.score, 0)
  })

  // Resetear formulario
  const resetForm = () => {
    Object.assign(form, initialState())
    templateSections.value = []
    dynamicScores.value = {}
    dynamicErrors.value = []
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

  // Build dynamicScores array for backend
  const buildDynamicScoresArray = (): DynamicScoreSection[] => {
    return templateSections.value.map((section) => ({
      sectionId: section.id,
      sectionTitle: section.title,
      sectionWeight: section.weight || 0,
      items: (section.items || []).map((item: any) => ({
        itemId: item.id,
        itemDescription: item.description,
        score: dynamicScores.value[section.id]?.[item.id] ?? null,
      })),
    }))
  }

  // Guardar evaluación
  const saveEvaluation = async (evaluationId?: string): Promise<boolean> => {
    saving.value = true
    submitError.value = ''

    try {
      const body: Record<string, any> = {
        empleadoId: form.empleadoId,
        cargo: form.cargo,
        habilidades: form.habilidades,
        desempeno: form.desempeno,
        recomendaciones: form.recomendaciones,
      }

      if (form.templateId) {
        body.templateId = form.templateId
      }
      if (form.positionId) {
        body.positionId = form.positionId
      }

      // If using dynamic template, add dynamicScores
      if (templateSections.value.length > 0) {
        body.dynamicScores = buildDynamicScoresArray()
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
    templateSections,
    dynamicScores,
    dynamicErrors,
    hasDynamicErrors,
    firstErrorSectionId,
    sectionScores,
    dynamicPuntajeTotal,
    puntajeTotal,
    puntajeHabilidades,
    puntajeDesempeno,
    loadEvaluation,
    loadTemplateForPosition,
    updateScore,
    validateDynamicScores,
    resetForm,
    saveEvaluation,
  }
}