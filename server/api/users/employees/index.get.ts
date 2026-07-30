import { User } from '~~/server/models/User'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.USERS_READ)

  const session = await getUserSession(event)
  const userId = session.user?.id
  const userRoles = session.user?.roles ?? []

  let filter: Record<string, any> = {}

  // Si es manager, solo ve sus empleados asignados
  if (userRoles.includes('manager')) {
    filter.bossId = userId
  }

  const employees = await User.find(filter)
    .select('name email roles bossId positionId')
    .populate('positionId', 'name')
    .sort({ name: 1 })
    .lean()

  return employees.map((emp: any) => ({
    id: emp._id?.toString?.() ?? '',
    name: emp.name ?? 'Sin nombre',
    email: emp.email,
    roles: emp.roles ?? [],
    bossId: emp.bossId?.toString?.() ?? null,
    positionId: emp.positionId?._id?.toString?.() ?? emp.positionId?.toString?.() ?? null,
    positionName: emp.positionId?.name ?? null,
  }))
})