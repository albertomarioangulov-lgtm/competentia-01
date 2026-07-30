import { Position } from '~~/server/models/Position'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.POSITIONS_READ)

  const query = getQuery(event)
  const filter: Record<string, any> = {}

  if (query.active !== undefined) {
    filter.active = query.active === 'true'
  }

  const positions = await Position.find(filter)
    .select('name description active')
    .sort({ name: 1 })
    .lean()

  return positions.map((pos: any) => ({
    id: pos._id?.toString?.() ?? '',
    name: pos.name,
    description: pos.description,
    active: pos.active,
  }))
})