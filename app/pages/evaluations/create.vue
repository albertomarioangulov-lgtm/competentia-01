<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { can, PERMISSIONS } = usePermissions()

if (!can(PERMISSIONS.EVALUATIONS_CREATE)) {
  throw createError({ statusCode: 403, statusMessage: 'Acceso denegado' })
}

const handleSaved = () => {
  navigateTo('/evaluations')
}
</script>

<template>
  <div>
    <EvaluationsForm @saved="handleSaved" />
  </div>
</template>