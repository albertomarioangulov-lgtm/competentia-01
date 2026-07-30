<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { can, PERMISSIONS } = usePermissions()
const { positions, loading, error, fetchPositions } = usePositions()

const showForm = ref(false)
const selectedPosition = ref<Record<string, any> | null>(null)

const openEdit = (position: Record<string, any>) => {
  selectedPosition.value = position
  showForm.value = true
}

const openCreate = () => {
  selectedPosition.value = null
  showForm.value = true
}

const handleSaved = () => {
  fetchPositions()
}

onMounted(() => {
  if (can(PERMISSIONS.POSITIONS_READ)) {
    fetchPositions()
  }
})
</script>

<template>
  <template v-if="can(PERMISSIONS.POSITIONS_READ)">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h6 font-weight-bold">
        Positions
      </h2>
      <v-spacer />
      <v-btn
        v-if="can(PERMISSIONS.POSITIONS_CREATE)"
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreate"
      >
        New Position
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Description</th>
          <th class="text-left">Status</th>
          <th v-if="can(PERMISSIONS.POSITIONS_UPDATE)" class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4">
            <v-progress-linear indeterminate />
          </td>
        </tr>
        <tr v-else-if="positions.length === 0">
          <td colspan="4" class="text-center text-grey">
            No positions found
          </td>
        </tr>
        <tr v-for="position in positions" :key="position.id">
          <td>{{ position.name }}</td>
          <td>{{ position.description || '-' }}</td>
          <td>
            <v-chip
              :color="position.active ? 'success' : 'grey'"
              size="small"
              variant="tonal"
            >
              {{ position.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </td>
          <td v-if="can(PERMISSIONS.POSITIONS_UPDATE)" class="text-right">
            <v-btn
              variant="text"
              icon="mdi-pencil"
              size="small"
              @click="openEdit(position)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <PositionsForm
      v-model="showForm"
      :position="selectedPosition"
      @saved="handleSaved"
    />
  </template>
  <template v-else>
    <v-alert type="warning" title="Access denied" text="You don't have permission to access this page." />
  </template>
</template>