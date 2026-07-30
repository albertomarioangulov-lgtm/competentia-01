import { EvaluationTemplate } from '~~/server/models/EvaluationTemplate'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.TEMPLATES_UPDATE)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Template ID is required' })
  }

  const body = await readBody(event)

  const template = await EvaluationTemplate.findById(id)
  if (!template) {
    throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  }

  if (body.name !== undefined) {
    if (!body.name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Template name cannot be empty' })
    }
    template.name = body.name.trim()
  }
  if (body.description !== undefined) template.description = body.description.trim()
  if (body.positionId !== undefined) template.positionId = body.positionId
  if (body.sections !== undefined) template.sections = body.sections
  if (body.active !== undefined) template.active = body.active

  await template.save()

  return { id: template._id.toString(), message: 'Template updated successfully' }
})