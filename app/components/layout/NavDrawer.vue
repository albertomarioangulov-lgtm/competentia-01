<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const { can, PERMISSIONS, hasRole } = usePermissions()

const navItems = computed(() => [
  { title: 'Inicio', icon: 'mdi-home-outline', to: '/' },
  {
    title: 'Gestión',
    icon: 'mdi-folder-outline',
    children: [
      // ...(can(PERMISSIONS.CLIENTS_READ)
      //   ? [{ title: 'Clientes', icon: 'mdi-account-tie-outline', to: '/clients' }]
      //   : []),
      // ...(can(PERMISSIONS.ORDERS_READ)
      //   ? [{ title: 'Órdenes', icon: 'mdi-clipboard-list-outline', to: '/orders' }]
      //   : []),
      ...(can(PERMISSIONS.USERS_READ)
        ? [{ title: 'Usuarios', icon: 'mdi-account-multiple-outline', to: '/users' }]
        : []),
      ...(can(PERMISSIONS.EVALUATIONS_READ)
        ? [{ title: 'Evaluaciones', icon: 'mdi-clipboard-check-outline', to: '/evaluations' }]
        : []),
      // ...(can(PERMISSIONS.ROUTES_READ)
      //   ? [{ title: 'Rutas', icon: 'mdi-map-marker-path', to: '/routes' }]
      //   : []),
      // ...(can(PERMISSIONS.ORDERS_READ)
      //   ? [{ title: 'Bodega', icon: 'mdi-warehouse', to: '/warehouse' }]
      //   : []),
      // ...(can(PERMISSIONS.ORDERS_READ)
      //   ? [{ title: 'Ubicaciones', icon: 'mdi-map-marker-outline', to: '/locations' }]
      //   : []),
      // ...(can(PERMISSIONS.NOTICES_READ)
      //   ? [{ title: 'Avisos', icon: 'mdi-alert-circle-outline', to: '/notices' }]
      //   : []),
      // { title: 'Eventos', icon: 'mdi-calendar-clock-outline', to: '/events' },
      // { title: 'Reportes', icon: 'mdi-file-chart-outline', to: '/reports' },
    ],
  },
  ...(hasRole('driver')
    ? [{ title: 'Panel Conductor', icon: 'mdi-steering', to: '/driver' }]
    : []),
  { title: 'Perfil', icon: 'mdi-account-circle-outline', to: '/profile' },
  { title: 'Ajustes', icon: 'mdi-cog-outline', to: '/settings' },
])
</script>

<template>
  <v-navigation-drawer v-model="drawer" app width="260" class="bg-surface">
    <v-list nav >
      <v-list-item density="compact">
        <v-list-item-title class="text-h6">MNT-PRO</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2" />

      <template v-for="item in navItems" :key="item.title">
        <!-- Items sin submenú -->
        <v-list-item
          v-if="!item.children"
          :to="item.to"
          clickable
          rounded="lg"
          variant="text"
          density="compact"
          color="primary"
        >
          <template #prepend>
            <!-- <v-icon size="small">{{ item.icon }}</v-icon> -->
            <v-icon>{{ item.icon }}</v-icon>
            <!-- <Icon size="1.5em" :name="item.icon"/> -->
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <!-- Items con submenú -->
        <v-list-group v-else :value="item.title">
          <template #activator="{ props: groupProps }">
            <v-list-item
              v-bind="groupProps"
              rounded="lg"
              variant="text"
              density="compact"
              color="primary"
            >
              <template #prepend>
                <!-- <v-icon size="">{{ item.icon }}</v-icon> -->
                <v-icon>{{ item.icon }}</v-icon>
                <!-- <Icon size="1.5em" :name="item.icon"/> -->
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <!-- Subitems -->
          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.to"
            clickable
            rounded="lg"
            variant="text"
            density="compact"
            color="primary"
            class="pl-8"
          >
            <template #prepend>
              <!-- <v-icon size="">{{ child.icon }}</v-icon> -->
              <v-icon>{{ child.icon }}</v-icon>
              <!-- <Icon size="1.5em" :name="child.icon"/> -->
            </template>
            <v-list-item-title class="text-caption">{{ child.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

