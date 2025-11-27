import express from 'express'
import request from 'supertest'
import { jest, describe, it, expect, afterEach } from '@jest/globals'

// Mock de middlewares de auth para NO exigir token en pruebas
jest.unstable_mockModule('../src/middlewares/auth/AuthMiddleware', () => ({
  authMiddleware: (req, _res, next) => { req.user = { id_rol: 1 }; next() }, // finge usuario admin
  adminMiddleware: (_req, _res, next) => next(),                              // bypass admin
  permissionMiddleware: () => (_req, _res, next) => next()                    // bypass permisos
}))

// Servicio de rol mockeado (lo que normalmente hablaría con DB/ORM)
const roleServiceMock = {
  createRole: jest.fn(),
  updateRole: jest.fn()
}

// Inyección del servicio simulado, sustituyendo el real
jest.unstable_mockModule('../src/services/auth/RoleService', () => ({
  default: roleServiceMock
}))

// Usar las mismas validaciones reales del backend
const { validationResult } = await import('express-validator')
const AuthValidationsModule = await import('../src/middlewares/auth/AuthValidations.js')
const { createRoleValidation, updateRoleValidation, idValidation } = AuthValidationsModule

// Montaje de app y router en memoria (Express)
const app = express()
app.use(express.json())

// Endpoint POST /api/roles con validaciones reales + servicio mock
const router = express.Router()
router.post('/', createRoleValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Datos de validación incorrectos', errors: errors.array() })
  }
  try {
    const role = await roleServiceMock.createRole(req.body)
    res.status(201).json({ success: true, data: role, message: 'Rol creado exitosamente' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Endpoint PUT /api/roles/:id con validación de id + payload y servicio mock
router.put('/:id', idValidation, updateRoleValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Datos de validación incorrectos', errors: errors.array() })
  }
  try {
    const { id } = req.params
    const updated = await roleServiceMock.updateRole(id, req.body)
    res.status(200).json({ success: true, data: updated, message: 'Rol actualizado exitosamente' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})
app.use('/api/roles', router)

// Limpieza de mocks tras cada test
afterEach(() => {
  jest.clearAllMocks()
})

// =====================
// Casos: CREAR ROL
// =====================
describe('POST /api/roles', () => {
  // ✔ Rol creado correctamente cuando la información es válida
  it('debería crear un rol y devolver 201', async () => {
    const payload = { nombre_rol: 'Supervisor', descripcion: 'desc' }
    const created = { id_rol: 5, ...payload, estado: true }
    roleServiceMock.createRole.mockResolvedValue(created)

    const res = await request(app).post('/api/roles').send(payload).expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject(created)
    expect(roleServiceMock.createRole).toHaveBeenCalledTimes(1)
  })

  // ✔ Fallo cuando el nombre es vacío o nulo
  it('debería devolver 400 cuando el nombre es inválido', async () => {
    const payload = { nombre_rol: '', descripcion: 'desc' } // gatilla createRoleValidation

    const res = await request(app).post('/api/roles').send(payload).expect(400)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Datos de validación incorrectos')
    expect(roleServiceMock.createRole).not.toHaveBeenCalled() // no llega al servicio
  })

  // ✔ Manejo de error ante excepción interna
  it('debería manejar excepción interna y responder 400', async () => {
    const payload = { nombre_rol: 'Supervisor', descripcion: 'desc' }
    roleServiceMock.createRole.mockRejectedValue(new Error('Fallo DB'))

    const res = await request(app).post('/api/roles').send(payload).expect(400)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Fallo DB')              // mensaje de error propagado
    expect(roleServiceMock.createRole).toHaveBeenCalledTimes(1)
  })
})

// =====================
// Casos: EDITAR ROL
// =====================
describe('PUT /api/roles/:id', () => {
  // ✔ Edición exitosa cuando el rol existe
  it('debería actualizar rol cuando existe', async () => {
    const id = 7
    const changes = { nombre_rol: 'Supervisor Senior' }
    const updated = { id_rol: id, nombre_rol: 'Supervisor Senior', descripcion: 'desc', estado: true }
    roleServiceMock.updateRole.mockResolvedValue(updated)

    const res = await request(app).put(`/api/roles/${id}`).send(changes).expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject(updated)
    expect(roleServiceMock.updateRole).toHaveBeenCalledWith(String(id), changes)
  })

  // ✔ Error 404/400 cuando el rol no existe (en proyecto actual retorna 400 en catch)
  it('debería devolver 400 cuando no existe el rol', async () => {
    const id = 999
    roleServiceMock.updateRole.mockRejectedValue(new Error('Rol no encontrado'))

    const res = await request(app).put(`/api/roles/${id}`).send({ descripcion: 'x' }).expect(400)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Rol no encontrado')
  })

  // ✔ Validación cuando el nombre del rol es inválido
  it('debería devolver 400 por nombre inválido', async () => {
    const id = 7

    const res = await request(app).put(`/api/roles/${id}`).send({ nombre_rol: '' }).expect(400)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Datos de validación incorrectos')
    expect(roleServiceMock.updateRole).not.toHaveBeenCalled() // bloqueado por middleware
  })

  // ✔ Prueba ante excepción inesperada
  it('debería manejar excepción inesperada', async () => {
    const id = 7
    roleServiceMock.updateRole.mockRejectedValue(new Error('Timeout'))

    const res = await request(app).put(`/api/roles/${id}`).send({ descripcion: 'y' }).expect(400)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Timeout')
    expect(roleServiceMock.updateRole).toHaveBeenCalledTimes(1)
  })
})