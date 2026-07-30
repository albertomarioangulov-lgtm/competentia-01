<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { can, PERMISSIONS } = usePermissions()
const { templates, loading, error, fetchTemplates } = useEvaluationTemplates()
const { positions, fetchPositions } = usePositions()

const showForm = ref(false)
const selectedTemplate = ref<Record<string, any> | null>(null)
const filterPositionId = ref('')

const openEdit = (template: Record<string, any>) => {
  selectedTemplate.value = template
  showForm.value = true
}

const openCreate = () => {
  selectedTemplate.value = null
  showForm.value = true
}

const handleSaved = () => {
  fetchTemplates(filterPositionId.value || undefined)
}

const handleFilterChange = () => {
  fetchTemplates(filterPositionId.value || undefined)
}

const totalWeight = (sections: any[]) => {
  return sections.reduce((sum: number, s: any) => sum + (s.weight || 0), 0)
}

onMounted(() => {
  if (can(PERMISSIONS.TEMPLATES_READ)) {
    fetchTemplates()
    fetchPositions()
  }
})
</script>

<template>
  <template v-if="can(PERMISSIONS.TEMPLATES_READ)">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h6 font-weight-bold">
        Evaluation Templates
      </h2>
      <v-spacer />

      <div class="d-flex ga-2">
        <v-select
          v-model="filterPositionId"
          label="Filter by position"
          :items="positions"
          item-title="name"
          item-value="id"
          clearable
          density="compact"
          variant="outlined"
          style="min-width: 220px;"
          hide-details
          @update:model-value="handleFilterChange"
        />

        <v-btn
          v-if="can(PERMISSIONS.TEMPLATES_CREATE)"
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreate"
        >
          New Template
        </v-btn>
      </div>
    </div>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Position</th>
          <th class="text-left">Sections</th>
          <th class="text-left">Status</th>
          <th v-if="can(PERMISSIONS.TEMPLATES_UPDATE)" class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5">
            <v-progress-linear indeterminate />
          </td>
        </tr>
        <tr v-else-if="templates.length === 0">
          <td colspan="5" class="text-center text-grey">
            No templates found
          </td>
        </tr>
        <tr v-for="template in templates" :key="template.id">
          <td>
            <strong>{{ template.name }}</strong>
            <div v-if="template.description" class="text-caption text-grey">
              {{ template.description }}
            </div>
          </td>
          <td>{{ template.positionName || '-' }}</td>
          <td>
            <template v-if="template.sections?.length">
              <div v-for="sec in template.sections" :key="sec.id" class="text-caption">
                {{ sec.title }} ({{ sec.weight }}%) - {{ sec.items?.length || 0 }} items
              </div>
              <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">
                Total: {{ totalWeight(template.sections) }}%
              </v-chip>
            </template>
            <span v-else class="text-grey">-</span>
          </td>
          <td>
            <v-chip
              :color="template.active ? 'success' : 'grey'"
              size="small"
              variant="tonal"
            >
              {{ template.active ? 'Active' : 'Inactive' }}
            </v-chip>
          </td>
          <td v-if="can(PERMISSIONS.TEMPLATES_UPDATE)" class="text-right">
            <v-btn
              variant="text"
              icon="mdi-pencil"
              size="small"
              @click="openEdit(template)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <TemplatesForm
      v-model="showForm"
      :template="selectedTemplate"
      @saved="handleSaved"
    />
  </template>
  <template v-else>
    <v-alert type="warning" title="Access denied" text="You don't have permission to access this page." />
  </template>
</template>