<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { can, PERMISSIONS } = usePermissions()

if (!can(PERMISSIONS.EVALUATIONS_UPDATE)) {
  throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
}

const evaluationId = computed(() => route.params.id as string)

const handleSaved = () => {
  navigateTo(`/evaluations/${evaluationId.value}`)
}
</script>

<template>
  <div>
    <EvaluationsForm :id="evaluationId" @saved="handleSaved" />
  </div>
</template>