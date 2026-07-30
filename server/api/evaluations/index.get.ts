import { Evaluation } from '~~/server/models/Evaluation'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.EVALUATIONS_READ)

  const session = await getUserSession(event)
  const userId = session.user?.id
  const userRoles = session.user?.roles ?? []

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 15

  const filter: Record<string, any> = {}

  // Si es manager, solo ve sus propias evaluaciones
  if (userRoles.includes('manager')) {
    filter.evaluadorId = userId
  }

  // Filtro opcional por empleado
  if (query.empleadoId) {
    filter.empleadoId = query.empleadoId
  }

  const total = await Evaluation.countDocuments(filter)
  const evaluations = await Evaluation.find(filter)
    .populate('empleadoId', 'name email')
    .populate('evaluadorId', 'name email')
    .populate('positionId', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  return {
    items: evaluations.map((ev: any) => ({
      id: ev._id?.toString?.() ?? '',
      empleado: ev.empleadoId
        ? { id: ev.empleadoId._id?.toString?.() ?? '', name: ev.empleadoId.name, email: ev.empleadoId.email }
        : null,
      evaluador: ev.evaluadorId
        ? { id: ev.evaluadorId._id?.toString?.() ?? '', name: ev.evaluadorId.name }
        : null,
      fecha: ev.fecha,
      cargo: ev.cargo,
      templateId: ev.templateId?.toString?.() ?? null,
      positionId: ev.positionId?._id?.toString?.() ?? ev.positionId?.toString?.() ?? null,
      positionName: ev.positionId?.name ?? null,
      dynamicScores: ev.dynamicScores ?? [],
      createdAt: ev.createdAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})