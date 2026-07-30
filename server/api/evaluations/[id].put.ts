import { Evaluation } from '~~/server/models/Evaluation'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.EVALUATIONS_UPDATE)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const body = await readBody(event)

  const evaluation = await Evaluation.findByIdAndUpdate(
    id,
    {
      cargo: body.cargo,
      habilidades: body.habilidades,
      desempeno: body.desempeno,
      recomendaciones: body.recomendaciones,
    },
    { new: true }
  )

  if (!evaluation) {
    throw createError({ statusCode: 404, statusMessage: 'Evaluación no encontrada' })
  }

  return {
    id: evaluation._id?.toString?.() ?? '',
    message: 'Evaluación actualizada exitosamente',
  }
})