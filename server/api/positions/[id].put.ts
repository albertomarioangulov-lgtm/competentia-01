import { Position } from '~~/server/models/Position'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.POSITIONS_UPDATE)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Position ID is required' })
  }

  const body = await readBody(event)

  const position = await Position.findById(id)
  if (!position) {
    throw createError({ statusCode: 404, statusMessage: 'Position not found' })
  }

  if (body.name !== undefined) {
    if (!body.name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Position name cannot be empty' })
    }
    const existing = await Position.findOne({ name: body.name.trim(), _id: { $ne: id } })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'A position with this name already exists' })
    }
    position.name = body.name.trim()
  }

  if (body.description !== undefined) {
    position.description = body.description.trim()
  }

  if (body.active !== undefined) {
    position.active = body.active
  }

  await position.save()

  return {
    id: position._id.toString(),
    name: position.name,
    description: position.description,
    active: position.active,
  }
})