import { ref } from 'vue'

export const usePositions = () => {
  const positions = ref<Array<Record<string, any>>>([])
  const loading = ref(false)
  const error = ref('')

  const fetchPositions = async (activeOnly = false) => {
    error.value = ''
    loading.value = true
    try {
      const params = activeOnly ? { active: 'true' } : {}
      const result = await $fetch('/api/positions', { params })
      positions.value = result as any[]
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Error loading positions'
    } finally {
      loading.value = false
    }
  }

  const createPosition = async (data: { name: string; description?: string; active?: boolean }) => {
    error.value = ''
    try {
      await $fetch('/api/positions', {
        method: 'POST',
        body: data,
      })
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Error creating position'
      return false
    }
  }

  const updatePosition = async (id: string, data: { name?: string; description?: string; active?: boolean }) => {
    error.value = ''
    try {
      await $fetch(`/api/positions/${id}`, {
        method: 'PUT',
        body: data,
      })
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Error updating position'
      return false
    }
  }

  return {
    positions,
    loading,
    error,
    fetchPositions,
    createPosition,
    updatePosition,
  }
}