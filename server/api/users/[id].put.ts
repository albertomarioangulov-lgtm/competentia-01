import { z } from 'zod'
import { User } from '~~/server/models/User'
import { PERMISSIONS } from '~~/shared/permissions'
import { requirePermission } from '~~/server/utils/permissions'

const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(6).optional(),
  roles: z.string().optional(),
  bossId: z.string().nullable().optional(),
  positionId: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.USERS_UPDATE)

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de usuario no proporcionado',
    })
  }

  const body = await readBody(event)
  const result = updateUserSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de usuario fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const { name, email, password, roles, bossId, positionId } = result.data

  const user = await User.findById(id)
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado',
    })
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'El correo ya está registrado',
      })
    }
    user.email = email
  }

  if (name) user.name = name
  if (password) user.password = await User.encryptPassword(password)
  
  if (roles) {
    const roleList = roles.split(',').map((role) => role.trim()).filter(Boolean)
    user.roles = roleList
  }

  // bossId: null remueve el jefe, string lo asigna
  if (bossId !== undefined) {
    // Validar que bossId sea un ObjectId válido antes de asignarlo
    if (bossId !== null && !bossId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de jefe inválido',
      })
    }
    user.bossId = bossId as any
  }

  if (positionId !== undefined) {
    if (positionId !== null && !positionId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid position ID',
      })
    }
    user.positionId = positionId as any
  }

  try {
    await user.save()
  } catch (err: any) {
    // Manejar errores de validación de Mongoose
    if (err.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Error de validación',
        data: err.message,
      })
    }
    // Manejar errores de cast (ej: ObjectId inválido)
    if (err.name === 'CastError') {
      throw createError({
        statusCode: 400,
        statusMessage: `ID inválido: ${err.path}`,
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno al guardar el usuario',
    })
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: user.roles,
    bossId: user.bossId?.toString?.() ?? null,
    positionId: user.positionId?.toString?.() ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
})
