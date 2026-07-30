import { ref } from 'vue'

export const useEvaluationTemplates = () => {
  const templates = ref<Array<Record<string, any>>>([])
  const loading = ref(false)
  const error = ref('')

  const fetchTemplates = async (positionId?: string) => {
    error.value = ''
    loading.value = true
    try {
      const params: Record<string, string> = {}
      if (positionId) params.positionId = positionId
      const result = await $fetch('/api/evaluation-templates', { params })
      templates.value = result as any[]
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Error loading templates'
    } finally {
      loading.value = false
    }
  }

  const getTemplateByPosition = async (positionId: string) => {
    try {
      const result = await $fetch(`/api/evaluation-templates/by-position/${positionId}`)
      return result as Record<string, any> | null
    } catch {
      return null
    }
  }

  const createTemplate = async (data: Record<string, any>) => {
    error.value = ''
    try {
      await $fetch('/api/evaluation-templates', {
        method: 'POST',
        body: data,
      })
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Error creating template'
      return false
    }
  }

  const updateTemplate = async (id: string, data: Record<string, any>) => {
    error.value = ''
    try {
      await $fetch(`/api/evaluation-templates/${id}`, {
        method: 'PUT',
        body: data,
      })
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Error updating template'
      return false
    }
  }

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    getTemplateByPosition,
    createTemplate,
    updateTemplate,
  }
}