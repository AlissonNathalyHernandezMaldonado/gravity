export interface User {
  id_usuario: number
  nombre: string
  direccion_usuario: string
  correo_usuario: string
  contraseña: string
  id_rol: number
  nombre_rol?: string
}

export interface LoginRequest {
  correo_usuario: string
  contraseña: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  usuario?: {
    id_usuario: number
    nombre: string
    correo_usuario: string
    direccion_usuario: string
    rol: string
  }
}

export interface AuthUser {
  id_usuario: number
  nombre: string
  correo_usuario: string
  direccion_usuario: string
  rol: string
}
