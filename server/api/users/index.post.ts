import { z } from 'zod'
import { User } from '~~/server/models/User'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().optional(),
  roles: z.string().optional(),
  bossId: z.string().nullable().optional(),
  positionId: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.USERS_CREATE)

  const body = await readBody(event)
  const result = createUserSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de usuario fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const { name, email, password, roles, bossId, positionId } = result.data

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'El correo ya está registrado',
    })
  }

  const roleList = roles?.split(',').map((role) => role.trim()).filter(Boolean) ?? []
  const isEmployee = roleList.includes('employee')

  // Solo encriptar password si se proporciona (empleados no tienen password)
  let hashedPassword: string | undefined
  if (password) {
    hashedPassword = await User.encryptPassword(password)
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    roles: roleList,
    bossId: isEmployee && bossId ? bossId : null,
    positionId: positionId || null,
  })

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: user.roles,
    bossId: user.bossId?.toString?.() ?? null,
    positionId: user.positionId?.toString?.() ?? null,
    createdAt: user.createdAt,
  }
})
