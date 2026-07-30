import { Evaluation } from '~~/server/models/Evaluation'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.EVALUATIONS_READ)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const evaluation = await Evaluation.findById(id)
    .populate('empleadoId', 'name email')
    .populate('evaluadorId', 'name email')
    .populate('positionId', 'name')
    .lean()

  if (!evaluation) {
    throw createError({ statusCode: 404, statusMessage: 'Evaluación no encontrada' })
  }

  const ev = evaluation as any

  return {
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
    habilidades: ev.habilidades,
    desempeno: ev.desempeno,
    dynamicScores: ev.dynamicScores ?? [],
    recomendaciones: ev.recomendaciones,
    createdAt: ev.createdAt,
    updatedAt: ev.updatedAt,
  }
})