<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
  puntajeTotal,
  puntajeHabilidades,
  puntajeDesempeno,
  loadEvaluation,
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

const loadingEvaluation = ref(false)

const fetchEvaluationData = async (id: string) => {
  loadingEvaluation.value = true
  try {
    const res = await fetch(`/api/evaluations/${id}`)
    if (res.ok) {
      const data = await res.json()
      loadEvaluation(data)
    } else {
      submitError.value = 'Error al cargar la evaluación'
    }
  } catch {
    submitError.value = 'Error al cargar la evaluación'
  } finally {
    loadingEvaluation.value = false
  }
}

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
  const success = await saveEvaluation(props.id || undefined)
  if (success) {
    emit('saved')
  }
}

const steps = computed(() => [
  { title: 'General', value: 0 },
  { title: 'Metahabilidades', value: 1 },
  { title: 'Betahabilidades', value: 2 },
  { title: 'Intrapersonales', value: 3 },
  { title: 'Operativas', value: 4 },
  { title: 'Directivas', value: 5 },
  { title: 'Desempeño', value: 6 },
  { title: 'Resumen', value: 7 },
])
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
      <v-alert v-if="submitError" type="error" class="mb-4" closable>
        {{ submitError }}
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

          <v-stepper-window-item :value="1">
            <p class="text-caption text-grey mb-4">
              <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
              <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
              <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
              <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
              <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
            </p>

            <EvaluationsSkillsSection
              :habilidades="form.habilidades.metahabilidades"
              group-title="Metahabilidades"
            />
          </v-stepper-window-item>

          <v-stepper-window-item :value="2">
            <p class="text-caption text-grey mb-4">
              <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
              <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
              <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
              <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
              <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
            </p>

            <EvaluationsSkillsSection
              :habilidades="form.habilidades.betahabilidades"
              group-title="Betahabilidades"
            />
          </v-stepper-window-item>

          <v-stepper-window-item :value="3">
            <p class="text-caption text-grey mb-4">
              <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
              <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
              <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
              <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
              <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
            </p>

            <EvaluationsSkillsSection
              :habilidades="form.habilidades.habilidadesInterpersonales"
              group-title="Habilidades Interpersonales"
            />
          </v-stepper-window-item>

          <v-stepper-window-item :value="4">
            <p class="text-caption text-grey mb-4">
              <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
              <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
              <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
              <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
              <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
            </p>

            <EvaluationsSkillsSection
              :habilidades="form.habilidades.habilidadesOperativas"
              group-title="Habilidades Operativas"
            />
          </v-stepper-window-item>

          <v-stepper-window-item :value="5">
            <p class="text-caption text-grey mb-4">
              <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
              <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
              <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
              <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
              <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
            </p>

            <EvaluationsSkillsSection
              :habilidades="form.habilidades.habilidadesDirectivas"
              group-title="Habilidades Directivas"
            />
          </v-stepper-window-item>

          <v-stepper-window-item :value="6">
            <p class="text-caption text-grey mb-4">
              <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
              <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
              <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
              <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
              <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
            </p>

            <EvaluationsPerformanceSection :items="form.desempeno" />
          </v-stepper-window-item>

          <v-stepper-window-item :value="7">
            <v-form @submit.prevent="submit">
              <EvaluationsScoreSummary
                :puntaje-habilidades="puntajeHabilidades"
                :puntaje-desempeno="puntajeDesempeno"
                :puntaje-total="puntajeTotal"
              />

              <v-divider class="my-4" />

              <p class="text-caption text-grey mb-4">
                Revisa los puntajes antes de guardar. Puedes regresar a los pasos anteriores para ajustar las calificaciones.
              </p>
            </v-form>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions
          :disabled="saving"
          @click:next="step = Math.min(step + 1, 7)"
          @click:prev="step = Math.max(step - 1, 0)"
          :next-text="step === 7 ? 'Guardar' : 'Siguiente'"
          prev-text="Anterior"
        />
      </v-stepper>

      <!-- Vertical stepper -->
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
            <span style="cursor: pointer; user-select: none;">
              General
            </span>
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
                  hint="Selecciona el empleado a evaluar"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.cargo"
                  label="Cargo"
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
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 1"
          :value="1"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Metahabilidades
            </span>
          </template>
          <p class="text-caption text-grey mb-4">
            <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
            <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
            <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
            <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
            <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
          </p>

          <EvaluationsSkillsSection
            :habilidades="form.habilidades.metahabilidades"
            group-title="Metahabilidades"
          />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 2"
          :value="2"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Betahabilidades
            </span>
          </template>
          <p class="text-caption text-grey mb-4">
            <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
            <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
            <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
            <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
            <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
          </p>

          <EvaluationsSkillsSection
            :habilidades="form.habilidades.betahabilidades"
            group-title="Betahabilidades"
          />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 3"
          :value="3"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Habilidades Interpersonales
            </span>
          </template>
          <p class="text-caption text-grey mb-4">
            <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
            <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
            <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
            <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
            <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
          </p>

          <EvaluationsSkillsSection
            :habilidades="form.habilidades.habilidadesInterpersonales"
            group-title="Habilidades Interpersonales"
          />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 4"
          :value="4"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Habilidades Operativas
            </span>
          </template>
          <p class="text-caption text-grey mb-4">
            <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
            <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
            <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
            <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
            <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
          </p>

          <EvaluationsSkillsSection
            :habilidades="form.habilidades.habilidadesOperativas"
            group-title="Habilidades Operativas"
          />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 5"
          :value="5"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Habilidades Directivas
            </span>
          </template>
          <p class="text-caption text-grey mb-4">
            <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
            <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
            <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
            <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
            <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
          </p>

          <EvaluationsSkillsSection
            :habilidades="form.habilidades.habilidadesDirectivas"
            group-title="Habilidades Directivas"
          />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 6"
          :value="6"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Desempeño
            </span>
          </template>
          <p class="text-caption text-grey mb-4">
            <v-icon start size="x-small" color="red" class="mb-1">mdi-star-outline</v-icon> 1 No cumple ·
            <v-icon start size="x-small" color="orange" class="mb-1">mdi-star-half-full</v-icon> 2 Por debajo ·
            <v-icon start size="x-small" color="warning" class="mb-1">mdi-star</v-icon> 3 Cumple ·
            <v-icon start size="x-small" color="light-blue" class="mb-1">mdi-star</v-icon> 4 Supera ·
            <v-icon start size="x-small" color="green" class="mb-1">mdi-star</v-icon> 5 Excede
          </p>

          <EvaluationsPerformanceSection :items="form.desempeno" />
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          :complete="step > 7"
          :value="7"
          editable
        >
          <template #title>
            <span style="cursor: pointer; user-select: none;">
              Resumen
            </span>
          </template>
          <v-form @submit.prevent="submit">
            <EvaluationsScoreSummary
              :puntaje-habilidades="puntajeHabilidades"
              :puntaje-desempeno="puntajeDesempeno"
              :puntaje-total="puntajeTotal"
            />

            <v-divider class="my-4" />

            <p class="text-caption text-grey mb-4">
              Revisa los puntajes antes de guardar. Puedes regresar a los pasos anteriores para ajustar las calificaciones.
            </p>
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