// ============================================================
// Composable para listar y gestionar evaluaciones
// ============================================================

export const useEvaluations = () => {
  const evaluations = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const total = ref(0)
  const page = ref(1)
  const itemsPerPage = ref(15)
  const totalPages = ref(0)

  const fetchEvaluations = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await fetch(
        `/api/evaluations?page=${page.value}&limit=${itemsPerPage.value}`
      )
      if (!response.ok) {
        throw new Error('Error al cargar evaluaciones')
      }
      const data = await response.json()
      evaluations.value = data.items
      total.value = data.total
      page.value = data.page
      totalPages.value = data.totalPages
    } catch (err: any) {
      error.value = err.message || 'Error desconocido'
    } finally {
      loading.value = false
    }
  }

  const handleUpdateOptions = (options: { page: number; itemsPerPage: number }) => {
    page.value = options.page
    itemsPerPage.value = options.itemsPerPage
    fetchEvaluations()
  }

  return {
    evaluations,
    loading,
    error,
    total,
    page,
    itemsPerPage,
    totalPages,
    fetchEvaluations,
    handleUpdateOptions,
  }
}