import { Position } from '~~/server/models/Position'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.POSITIONS_READ)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Position ID is required' })
  }

  const position = await Position.findById(id).lean()
  if (!position) {
    throw createError({ statusCode: 404, statusMessage: 'Position not found' })
  }

  return {
    id: position._id.toString(),
    name: position.name,
    description: position.description,
    active: position.active,
  }
})