import { Evaluation } from '~~/server/models/Evaluation'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.EVALUATIONS_CREATE)

  const session = await getUserSession(event)
  const evaluadorId = session.user?.id

  const body = await readBody(event)

  const evaluation = await Evaluation.create({
    empleadoId: body.empleadoId,
    evaluadorId,
    fecha: body.fecha || new Date(),
    cargo: body.cargo,
    templateId: body.templateId || null,
    positionId: body.positionId || null,
    habilidades: body.habilidades,
    desempeno: body.desempeno,
    dynamicScores: body.dynamicScores ?? [],
    recomendaciones: body.recomendaciones || '',
  })

  return {
    id: evaluation._id?.toString?.() ?? '',
    message: 'Evaluación creada exitosamente',
  }
})