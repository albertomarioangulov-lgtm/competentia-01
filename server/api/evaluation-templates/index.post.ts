import { EvaluationTemplate } from '~~/server/models/EvaluationTemplate'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.TEMPLATES_CREATE)

  const session = await getUserSession(event)
  const userId = session.user?.id

  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Template name is required' })
  }
  if (!body.positionId) {
    throw createError({ statusCode: 400, statusMessage: 'Position is required' })
  }

  const template = await EvaluationTemplate.create({
    name: body.name.trim(),
    description: body.description?.trim() ?? '',
    positionId: body.positionId,
    sections: body.sections ?? [],
    active: body.active !== undefined ? body.active : true,
    createdBy: userId,
  })

  return {
    id: template._id.toString(),
    name: template.name,
    description: template.description,
    positionId: template.positionId.toString(),
    sections: template.sections,
    active: template.active,
  }
})