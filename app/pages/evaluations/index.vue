<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { can, PERMISSIONS } = usePermissions()

const {
  evaluations,
  loading,
  error,
  total,
  page,
  itemsPerPage,
  totalPages,
  fetchEvaluations,
  handleUpdateOptions,
} = useEvaluations()

const headers = [
  { title: 'Empleado', key: 'empleado', sortable: false },
  { title: 'Cargo', key: 'cargo', sortable: false },
  { title: 'Evaluador', key: 'evaluador', sortable: false },
  { title: 'Fecha', key: 'fecha', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleView = (item: any) => {
  navigateTo(`/evaluations/${item.id}`)
}

const handleEdit = (item: any) => {
  navigateTo(`/evaluations/${item.id}/edit`)
}

onMounted(() => {
  if (can(PERMISSIONS.EVALUATIONS_READ)) {
    fetchEvaluations()
  }
})
</script>

<template>
  <template v-if="can(PERMISSIONS.EVALUATIONS_READ)">
    <h2 class="text-h6 font-weight-bold mb-2 mt-0">
      Evaluaciones de Desempeño
    </h2>

    <v-toolbar>
      <v-spacer />
      <v-btn
        v-if="can(PERMISSIONS.EVALUATIONS_CREATE)"
        color="primary"
        prepend-icon="mdi-plus"
        @click="navigateTo('/evaluations/create')"
      >
        Nueva evaluación
      </v-btn>
    </v-toolbar>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-data-table-server
      :items="evaluations"
      :headers="headers"
      :loading="loading"
      :items-length="total"
      :page="page"
      :items-per-page="itemsPerPage"
      @update:options="handleUpdateOptions"
    >
      <template #item.empleado="{ item }">
        {{ item.empleado?.name ?? '—' }}
      </template>
      <template #item.evaluador="{ item }">
        {{ item.evaluador?.name ?? '—' }}
      </template>
      <template #item.fecha="{ item }">
        {{ formatDate(item.fecha) }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="handleView(item)"
        >
          Ver
        </v-btn>
        <v-btn
          v-if="can(PERMISSIONS.EVALUATIONS_UPDATE)"
          variant="text"
          size="small"
          color="orange"
          @click="handleEdit(item)"
        >
          Editar
        </v-btn>
      </template>
    </v-data-table-server>
  </template>
  <template v-else>
    <v-alert type="warning" title="Acceso denegado" text="No tienes permisos para acceder a esta página." />
  </template>
</template>