// ============================================================
// Definiciones de Permisos y Roles
// ============================================================

/**
 * Lista de todos los permisos disponibles en el sistema.
 * Formato: `recurso:accion`
 */
export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  CLIENTS_READ: 'clients:read',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',
  ROLES_READ: 'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  LOCATIONS_READ: 'locations:read',
  LOCATIONS_CREATE: 'locations:create',
  LOCATIONS_UPDATE: 'locations:update',
  LOCATIONS_DELETE: 'locations:delete',
  ASSETS_READ: 'assets:read',
  ASSETS_CREATE: 'assets:create',
  ASSETS_UPDATE: 'assets:update',
  ASSETS_DELETE: 'assets:delete',
  NOTICES_READ: 'notices:read',
  NOTICES_CREATE: 'notices:create',
  NOTICES_UPDATE: 'notices:update',
  NOTICES_DELETE: 'notices:delete',
  GARMENTS_READ: 'garments:read',
  GARMENTS_CREATE: 'garments:create',
  GARMENTS_UPDATE: 'garments:update',
  GARMENTS_DELETE: 'garments:delete',
  ORDERS_READ: 'orders:read',
  ORDERS_CREATE: 'orders:create',
  ORDERS_UPDATE: 'orders:update',
  ORDERS_DELETE: 'orders:delete',
  ROUTES_READ: 'routes:read',
  ROUTES_CREATE: 'routes:create',
  ROUTES_UPDATE: 'routes:update',
  ROUTES_DELETE: 'routes:delete',
  EVALUATIONS_READ: 'evaluations:read',
  EVALUATIONS_CREATE: 'evaluations:create',
  EVALUATIONS_UPDATE: 'evaluations:update',
  EVALUATIONS_DELETE: 'evaluations:delete',
  POSITIONS_READ: 'positions:read',
  POSITIONS_CREATE: 'positions:create',
  POSITIONS_UPDATE: 'positions:update',
  POSITIONS_DELETE: 'positions:delete',
  TEMPLATES_READ: 'templates:read',
  TEMPLATES_CREATE: 'templates:create',
  TEMPLATES_UPDATE: 'templates:update',
  TEMPLATES_DELETE: 'templates:delete',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Definición de roles del sistema,
 * cada uno con su lista de permisos asignados.
 */
export type RoleDefinition = {
  label: string
  description: string
  permissions: Permission[]
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  admin: {
    label: 'Administrador',
    description: 'Acceso total a todas las funcionalidades del sistema',
    permissions: Object.values(PERMISSIONS),
  },
  editor: {
    label: 'Editor',
    description: 'Puede ver y editar usuarios, clientes, ubicaciones, activos, avisos y prendas, pero no eliminarlos',
    permissions: [
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.CLIENTS_READ,
      PERMISSIONS.CLIENTS_CREATE,
      PERMISSIONS.CLIENTS_UPDATE,
      PERMISSIONS.LOCATIONS_READ,
      PERMISSIONS.LOCATIONS_CREATE,
      PERMISSIONS.LOCATIONS_UPDATE,
      PERMISSIONS.ASSETS_READ,
      PERMISSIONS.ASSETS_CREATE,
      PERMISSIONS.ASSETS_UPDATE,
      PERMISSIONS.NOTICES_READ,
      PERMISSIONS.NOTICES_CREATE,
      PERMISSIONS.NOTICES_UPDATE,
      PERMISSIONS.ROLES_READ,
      PERMISSIONS.GARMENTS_READ,
      PERMISSIONS.GARMENTS_CREATE,
      PERMISSIONS.GARMENTS_UPDATE,
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_CREATE,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.ROUTES_READ,
      PERMISSIONS.ROUTES_CREATE,
      PERMISSIONS.ROUTES_UPDATE,
      PERMISSIONS.ROUTES_DELETE,
    ],
  },
  viewer: {
    label: 'Visor',
    description: 'Solo puede ver información, sin modificar nada',
    permissions: [
      PERMISSIONS.USERS_READ,
      PERMISSIONS.CLIENTS_READ,
      PERMISSIONS.LOCATIONS_READ,
      PERMISSIONS.ASSETS_READ,
      PERMISSIONS.NOTICES_READ,
      PERMISSIONS.ROLES_READ,
      PERMISSIONS.GARMENTS_READ,
      PERMISSIONS.ORDERS_READ,
    ],
  },
  driver: {
    label: 'Conductor',
    description: 'Puede ver sus rutas asignadas y clientes, crear órdenes de ingreso y entregar órdenes de salida. No ve valores de dinero.',
    permissions: [
      PERMISSIONS.CLIENTS_READ,
      PERMISSIONS.GARMENTS_READ,
      PERMISSIONS.GARMENTS_CREATE,
      PERMISSIONS.GARMENTS_UPDATE,
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_CREATE,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.ROUTES_READ,
    ],
  },
  manager: {
    label: 'Jefe de área',
    description: 'Puede gestionar evaluaciones de desempeño de sus empleados a cargo',
    permissions: [
      PERMISSIONS.USERS_READ,
      PERMISSIONS.EVALUATIONS_READ,
      PERMISSIONS.EVALUATIONS_CREATE,
      PERMISSIONS.EVALUATIONS_UPDATE,
    ],
  },
  employee: {
    label: 'Empleado',
    description: 'Rol base para empleados, sin acceso al sistema por ahora',
    permissions: [],
  },
}

/**
 * Obtiene todos los permisos asociados a un conjunto de roles.
 */
export function getPermissionsForRoles(roles: string[]): Permission[] {
  const permissions = new Set<Permission>()

  for (const role of roles) {
    const definition = ROLE_DEFINITIONS[role]
    if (definition) {
      for (const perm of definition.permissions) {
        permissions.add(perm)
      }
    }
  }

  return Array.from(permissions)
}

/**
 * Verifica si un conjunto de roles tiene un permiso específico.
 */
export function hasPermission(roles: string[], permission: Permission): boolean {
  const perms = getPermissionsForRoles(roles)
  return perms.includes(permission)
}

/**
 * Lista de roles disponibles (las claves del objeto ROLE_DEFINITIONS).
 */
export const AVAILABLE_ROLES = Object.keys(ROLE_DEFINITIONS)

/**
 * Roles que tienen visibilidad de valores monetarios (precios, totales).
 * Los roles no incluidos aquí NO verán precios en la UI.
 */
export const MONETARY_VISIBILITY_ROLES = ['admin', 'editor']