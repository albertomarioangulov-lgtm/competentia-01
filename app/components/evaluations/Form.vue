<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useEvaluationForm } from '~/composables/evaluations/useEvaluationForm'

const props = withDefaults(defineProps<{
  id?: string
}>(), {
  id: '',
})

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const isEditing = computed(() => !!props.id)
const {
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
} = useEvaluationForm()

// Stepper
const step = ref(0)
const stepperDirection = ref<'horizontal' | 'vertical'>('horizontal')

// Cargar empleados (solo los del jefe logueado)
const employees = ref<any[]>([])
const loadingEmployees = ref(false)

const fetchEmployees = async () => {
  loadingEmployees.value = true
  try {
    const res = await fetch('/api/users/employees')
    if (res.ok) {
      employees.value = await res.json()
    }
  } finally {
    loadingEmployees.value = false
  }
}

// Watch employee selection to auto-load template
watch(() => form.empleadoId, async (newVal) => {
  if (!newVal || isEditing.value) return
  const employee = employees.value.find((e) => e.id === newVal)
  if (employee?.positionId) {
    form.cargo = employee.positionName || ''
    await loadTemplateForPosition(employee.positionId)
  }
})

const loadingEvaluation = ref(false)

const fetchEvaluationData = async (id: string) => {
  loadingEvaluation.value = true
  try {
    const res = await fetch(`/api/evaluations/${id}`)
    if (res.ok) {
      const data = await res.json()
      loadEvaluation(data)
      // If evaluation has template, reload it to get the template structure
      if (data.templateId && data.positionId) {
        await loadTemplateForPosition(data.positionId)
      }
    } else {
      submitError.value = 'Error al cargar la evaluación'
    }
  } catch {
    submitError.value = 'Error al cargar la evaluación'
  } finally {
    loadingEvaluation.value = false
  }
}

// Build stepper steps based on template
const steps = computed(() => {
  const base = [{ title: 'General', value: 0 }]

  if (templateSections.value.length > 0) {
    // Dynamic template steps
    for (const section of templateSections.value) {
      base.push({ title: section.title, value: base.length })
    }
  } else {
    // Legacy fixed steps
    base.push(
      { title: 'Metahabilidades', value: 1 },
      { title: 'Betahabilidades', value: 2 },
      { title: 'Intrapersonales', value: 3 },
      { title: 'Operativas', value: 4 },
      { title: 'Directivas', value: 5 },
    )
  }
  // Only add Desempeño for legacy (non-template) evaluations
  if (templateSections.value.length === 0) {
    base.push({ title: 'Desempeño', value: base.length })
  }
  base.push({ title: 'Resumen', value: base.length })
  return base
})

const maxStep = computed(() => steps.value.length - 1)

onMounted(() => {
  submitError.value = ''
  step.value = 0
  if (props.id) {
    fetchEvaluationData(props.id)
  } else {
    resetForm()
    fetchEmployees()
  }
})

const submit = async () => {
  // Validate all items have scores when using dynamic template
  if (templateSections.value.length > 0) {
    const valid = validateDynamicScores()
    if (!valid) {
      // Navigate to first section with errors
      if (firstErrorSectionId.value) {
        const sectionIndex = templateSections.value.findIndex(
          (s: any) => s.id === firstErrorSectionId.value
        )
        if (sectionIndex >= 0) {
          step.value = sectionIndex + 1 // +1 because General is step 0
        }
      }
      return
    }
  }

  const success = await saveEvaluation(props.id || undefined)
  if (success) {
    emit('saved')
  }
}

// Watch dynamic errors to update validation message reactively
const validationMessage = ref('')
const validationType = ref<'error' | 'success' | undefined>(undefined)

watch(() => dynamicErrors.value.length, (count) => {
  if (count > 0) {
    validationMessage.value = `Please answer all questions (${count} item(s) missing).`
    validationType.value = 'error'
  } else if (validationType.value === 'error') {
    // All errors resolved after having some
    validationMessage.value = 'All questions answered! ✓'
    validationType.value = 'success'
    // Clear success message after 3 seconds
    setTimeout(() => {
      if (validationType.value === 'success') {
        validationMessage.value = ''
        validationType.value = undefined
      }
    }, 3000)
  }
})

// Format score for display
const formatScore = (val: number) => Math.round(val * 100) / 100
</script>

<template>
  <div>
    <v-progress-linear
      :color="isEditing ? 'orange' : 'primary'"
      :indeterminate="saving"
      :model-value="saving ? undefined : 100"
    />

    <div class="d-flex align-center pa-4">
      <h2 class="text-h6">
        {{ isEditing ? 'Editar evaluación' : 'Nueva evaluación de desempeño' }}
      </h2>

      <v-spacer />

      <v-btn
        variant="tonal"
        size="small"
        :icon="stepperDirection === 'horizontal' ? 'mdi-swap-vertical' : 'mdi-swap-horizontal'"
        @click="stepperDirection = stepperDirection === 'horizontal' ? 'vertical' : 'horizontal'"
        :title="stepperDirection === 'horizontal' ? 'Cambiar a vertical' : 'Cambiar a horizontal'"
      />
    </div>

    <v-divider />

    <div class="pa-4">
      <v-alert v-if="submitError" type="error" class="mb-4" closable @click:close="submitError = ''">
        {{ submitError }}
      </v-alert>

      <!-- Dynamic validation feedback -->
      <v-alert
        v-if="validationMessage && validationType && templateSections.length > 0"
        :type="validationType"
        :variant="validationType === 'success' ? 'tonal' : 'flat'"
        class="mb-4"
        closable
        @click:close="validationMessage = ''; validationType = undefined"
      >
        {{ validationMessage }}
      </v-alert>

      <!-- Template info banner -->
      <v-alert
        v-if="templateSections.length > 0"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        This evaluation uses a dynamic template with {{ templateSections.length }} section(s).
        Total weight: {{ templateSections.reduce((s: number, sec: any) => s + (sec.weight || 0), 0) }}%
      </v-alert>

      <!-- Horizontal stepper -->
      <v-stepper
        v-if="stepperDirection === 'horizontal'"
        v-model="step"
        non-linear
        class="evaluation-stepper"
      >
        <v-stepper-header>
          <template v-for="(s, i) in steps" :key="s.value">
            <v-divider v-if="i > 0" />
            <v-stepper-item
              :complete="step > s.value"
              :value="s.value"
              editable
            >
              <template #title>
                <span style="cursor: pointer; user-select: none;">
                  {{ s.title }}
                </span>
              </template>
            </v-stepper-item>
          </template>
        </v-stepper-header>

        <v-stepper-window>
          <!-- General -->
          <v-stepper-window-item :value="0">
            <v-form @submit.prevent="submit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.empleadoId"
                    :items="employees"
                    item-title="name"
                    item-value="id"
                    label="Empleado"
                    :loading="loadingEmployees"
                    :disabled="isEditing"
                    required
                    hint="Selecciona el empleado a evaluar"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.cargo"
                    label="Cargo"
                    :readonly="templateSections.length > 0"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <v-textarea
                v-model="form.recomendaciones"
                label="Recomendaciones"
                rows="4"
              />
            </v-form>
          </v-stepper-window-item>

          <!-- Dynamic template sections -->
          <template v-for="(section, idx) in templateSections" :key="section.id">
            <v-stepper-window-item :value="idx + 1">
              <EvaluationsDynamicSection
                :section="section"
                :scores="dynamicScores"
                :errors="dynamicErrors"
                @update:score="updateScore"
              />
            </v-stepper-window-item>
          </template>

          <!-- Legacy sections (no dynamic template) -->
          <template v-if="templateSections.length === 0">
            <v-stepper-window-item :value="1">
              <EvaluationsSkillsSection
                :habilidades="form.habilidades.metahabilidades"
                group-title="Metahabilidades"
              />
            </v-stepper-window-item>

            <v-stepper-window-item :value="2">
              <EvaluationsSkillsSection
                :habilidades="form.habilidades.betahabilidades"
                group-title="Betahabilidades"
              />
            </v-stepper-window-item>

            <v-stepper-window-item :value="3">
              <EvaluationsSkillsSection
                :habilidades="form.habilidades.habilidadesInterpersonales"
                group-title="Habilidades Interpersonales"
              />
            </v-stepper-window-item>

            <v-stepper-window-item :value="4">
              <EvaluationsSkillsSection
                :habilidades="form.habilidades.habilidadesOperativas"
                group-title="Habilidades Operativas"
              />
            </v-stepper-window-item>

            <v-stepper-window-item :value="5">
              <EvaluationsSkillsSection
                :habilidades="form.habilidades.habilidadesDirectivas"
                group-title="Habilidades Directivas"
              />
            </v-stepper-window-item>
          </template>

          <!-- Desempeño (always shown for legacy) -->
          <v-stepper-window-item v-if="templateSections.length === 0" :value="templateSections.length + 1">
            <EvaluationsPerformanceSection :items="form.desempeno" />
          </v-stepper-window-item>

          <!-- Resumen -->
          <v-stepper-window-item :value="maxStep">
            <v-form @submit.prevent="submit">
              <!-- Dynamic template summary -->
              <template v-if="templateSections.length > 0">
                <h3 class="text-h6 mb-3">Score Summary</h3>
                <v-table density="compact" class="mb-4">
                  <thead>
                    <tr>
                      <th class="text-left">Section</th>
                      <th class="text-center">Weight</th>
                      <th class="text-center">Average</th>
                      <th class="text-center">Score</th>
                      <th class="text-center">Answered</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sec in sectionScores" :key="sec.sectionId">
                      <td>{{ sec.sectionTitle }}</td>
                      <td class="text-center">{{ sec.weight }}%</td>
                      <td class="text-center">{{ formatScore(sec.average) }}/5</td>
                      <td class="text-center">
                        <strong>{{ formatScore(sec.score) }}/{{ sec.total }}</strong>
                      </td>
                      <td class="text-center">{{ sec.answered }}/{{ templateSections.find((s: any) => s.id === sec.sectionId)?.items?.length || 0 }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="font-weight-bold">
                      <td>TOTAL</td>
                      <td class="text-center">100%</td>
                      <td />
                      <td class="text-center">
                        <strong :class="dynamicPuntajeTotal >= 70 ? 'text-success' : dynamicPuntajeTotal >= 50 ? 'text-warning' : 'text-error'">
                          {{ formatScore(dynamicPuntajeTotal) }}/100
                        </strong>
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </v-table>
              </template>

              <!-- Legacy summary -->
              <template v-else>
                <EvaluationsScoreSummary
                  :puntaje-habilidades="puntajeHabilidades"
                  :puntaje-desempeno="puntajeDesempeno"
                  :puntaje-total="puntajeTotal"
                />
              </template>

              <v-divider class="my-4" />

              <p class="text-caption text-grey mb-4">
                Revisa los puntajes antes de guardar. Puedes regresar a los pasos anteriores para ajustar las calificaciones.
              </p>
            </v-form>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions
          :disabled="saving"
          @click:next="step = Math.min(step + 1, maxStep)"
          @click:prev="step = Math.max(step - 1, 0)"
          :next-text="step === maxStep ? 'Guardar' : 'Siguiente'"
          prev-text="Anterior"
        />
      </v-stepper>

      <!-- Vertical stepper (simplified) -->
      <v-stepper-vertical
        v-else
        v-model="step"
        non-linear
        class="evaluation-stepper"
      >
        <v-stepper-vertical-item
          :complete="step > 0"
          :value="0"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">General</span>
          </template>
          <v-form @submit.prevent="submit">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.empleadoId"
                  :items="employees"
                  item-title="name"
                  item-value="id"
                  label="Empleado"
                  :loading="loadingEmployees"
                  :disabled="isEditing"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.cargo"
                  label="Cargo"
                  :readonly="templateSections.length > 0"
                />
              </v-col>
            </v-row>
            <v-divider class="my-4" />
            <v-textarea v-model="form.recomendaciones" label="Recomendaciones" rows="4" />
          </v-form>
        </v-stepper-vertical-item>

        <!-- Dynamic sections in vertical mode -->
        <template v-for="(section, idx) in templateSections" :key="section.id">
          <v-stepper-vertical-item
            :complete="step > idx + 1"
            :value="idx + 1"
            editable
          >
            <template #title>
              <span style="cursor: pointer; user-select: none;">{{ section.title }}</span>
            </template>
              <EvaluationsDynamicSection
                :section="section"
                :scores="dynamicScores"
                :errors="dynamicErrors"
                @update:score="updateScore"
              />
            </v-stepper-vertical-item>
          </template>

        <v-stepper-vertical-item
          :complete="step > maxStep"
          :value="maxStep"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">Summary</span>
          </template>
          <v-form @submit.prevent="submit">
            <template v-if="templateSections.length > 0">
              <h3 class="text-h6 mb-3">Score Summary</h3>
              <v-table density="compact" class="mb-4">
                <thead>
                  <tr>
                    <th class="text-left">Section</th>
                    <th class="text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sec in sectionScores" :key="sec.sectionId">
                    <td>{{ sec.sectionTitle }}</td>
                    <td class="text-center">{{ formatScore(sec.score) }}/{{ sec.total }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="font-weight-bold">
                    <td>TOTAL</td>
                    <td class="text-center">{{ formatScore(dynamicPuntajeTotal) }}/100</td>
                  </tr>
                </tfoot>
              </v-table>
            </template>
            <template v-else>
              <EvaluationsScoreSummary
                :puntaje-habilidades="puntajeHabilidades"
                :puntaje-desempeno="puntajeDesempeno"
                :puntaje-total="puntajeTotal"
              />
            </template>
          </v-form>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
    </div>

    <v-divider />

    <div class="d-flex pa-4 ga-2">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="navigateTo('/evaluations')"
      >
        Volver
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        :loading="saving"
        @click="submit"
      >
        {{ isEditing ? 'Guardar cambios' : 'Crear evaluación' }}
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.evaluation-stepper :deep(.v-stepper-header) {
  overflow-x: auto;
  flex-wrap: nowrap;
}
</style>