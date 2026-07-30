import { EvaluationTemplate } from '~~/server/models/EvaluationTemplate'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.TEMPLATES_READ)

  const positionId = getRouterParam(event, 'positionId')
  if (!positionId) {
    throw createError({ statusCode: 400, statusMessage: 'Position ID is required' })
  }

  const template = await EvaluationTemplate.findOne({
    positionId,
    active: true,
  }).populate('positionId', 'name').lean()

  if (!template) {
    return null
  }

  const t = template as any
  return {
    id: t._id?.toString?.() ?? '',
    name: t.name,
    description: t.description,
    positionId: t.positionId?._id?.toString?.() ?? t.positionId?.toString?.() ?? null,
    positionName: t.positionId?.name ?? null,
    sections: t.sections ?? [],
    active: t.active,
  }
})