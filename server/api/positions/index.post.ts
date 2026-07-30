import { Position } from '~~/server/models/Position'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.POSITIONS_CREATE)

  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Position name is required' })
  }

  const existing = await Position.findOne({ name: body.name.trim() })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'A position with this name already exists' })
  }

  const position = await Position.create({
    name: body.name.trim(),
    description: body.description?.trim() ?? '',
    active: body.active !== undefined ? body.active : true,
  })

  return {
    id: position._id.toString(),
    name: position.name,
    description: position.description,
    active: position.active,
  }
})