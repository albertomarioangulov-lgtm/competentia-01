import { EvaluationTemplate } from '~~/server/models/EvaluationTemplate'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.TEMPLATES_READ)

  const query = getQuery(event)
  const filter: Record<string, any> = {}

  if (query.positionId) {
    filter.positionId = query.positionId
  }
  if (query.active !== undefined) {
    filter.active = query.active === 'true'
  }

  const templates = await EvaluationTemplate.find(filter)
    .populate('positionId', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .lean()

  return templates.map((t: any) => ({
    id: t._id?.toString?.() ?? '',
    name: t.name,
    description: t.description,
    positionId: t.positionId?._id?.toString?.() ?? t.positionId?.toString?.() ?? null,
    positionName: t.positionId?.name ?? null,
    sections: t.sections ?? [],
    active: t.active,
    createdBy: t.createdBy?._id?.toString?.() ?? null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }))
})