import { executeQuery } from "./database"

export interface Usuario {
  id_usuario: number
  nombre: string
  direccion_usuario: string
  correo_usuario: string
  id_rol: number
}

export interface LoginData {
  correo_usuario: string
  contraseña: string
}

export interface RegisterData {
  nombre: string
  direccion_usuario: string
  correo_usuario: string
  contraseña: string
  id_rol?: number // Opcional, por defecto será 2 (user)
}

// Interface para el token decodificado
interface DecodedToken {
  id_usuario: number
  correo_usuario: string
  id_rol: number
  iat?: number
  exp?: number
}

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || "gravity-secret-key"

  // Función para hashear contraseñas usando Web Crypto API
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "gravity-salt")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Función para verificar contraseñas
  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password)
    return hashedInput === hashedPassword
  }

  // Función simple para crear JWT
  private static createJWT(payload: any): string {
    const header = {
      alg: "HS256",
      typ: "JWT",
    }

    const now = Math.floor(Date.now() / 1000)
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + 7 * 24 * 60 * 60, // 7 días
    }

    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(tokenPayload))
    const signature = btoa(this.JWT_SECRET + encodedHeader + encodedPayload)

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }

  // Función para verificar JWT
  private static verifyJWT(token: string): any | null {
    try {
      const [header, payload, signature] = token.split(".")
      const expectedSignature = btoa(this.JWT_SECRET + header + payload)

      if (signature !== expectedSignature) {
        return null
      }

      const decodedPayload = JSON.parse(atob(payload))
      const now = Math.floor(Date.now() / 1000)

      if (decodedPayload.exp < now) {
        return null // Token expirado
      }

      return decodedPayload
    } catch (error) {
      return null
    }
  }

  // Verificar si el usuario existe por correo
  static async getUserByEmail(correo_usuario: string): Promise<Usuario | null> {
    try {
      const query = "SELECT * FROM usuario WHERE correo_usuario = ?"
      const results = (await executeQuery(query, [correo_usuario])) as any[]

      if (results.length === 0) {
        return null
      }

      return results[0] as Usuario
    } catch (error) {
      console.error("Error fetching user by email:", error)
      throw new Error("Error al buscar usuario")
    }
  }

  // Obtener usuario por ID
  static async getUserById(userId: number): Promise<Usuario | null> {
    try {
      const query = "SELECT * FROM usuario WHERE id_usuario = ?"
      const results = (await executeQuery(query, [userId])) as any[]

      if (results.length === 0) {
        return null
      }

      return results[0] as Usuario
    } catch (error) {
      console.error("Error fetching user by ID:", error)
      throw new Error("Error al buscar usuario")
    }
  }

  // Login de usuario
  static async login(loginData: LoginData): Promise<{ usuario: Usuario; token: string }> {
    try {
      // Buscar usuario por correo
      const query = "SELECT * FROM usuario WHERE correo_usuario = ?"
      const results = (await executeQuery(query, [loginData.correo_usuario])) as any[]

      if (results.length === 0) {
        throw new Error("Usuario no encontrado")
      }

      const usuario = results[0]

      // Verificar contraseña
      let isValidPassword = false

      if (usuario.contraseña.startsWith("$2y$") || usuario.contraseña.startsWith("$2b$")) {
        // Para contraseñas hasheadas con bcrypt (usuarios existentes)
        // Comparación simple para compatibilidad
        isValidPassword = false // Forzar actualización de contraseña
      } else if (usuario.contraseña.length === 64) {
        // Contraseña hasheada con nuestro método
        isValidPassword = await this.verifyPassword(loginData.contraseña, usuario.contraseña)
      } else {
        // Contraseña en texto plano (usuarios antiguos)
        isValidPassword = loginData.contraseña === usuario.contraseña.trim()

        // Si es válida, actualizar a hash seguro
        if (isValidPassword) {
          const newHash = await this.hashPassword(loginData.contraseña)
          await executeQuery("UPDATE usuario SET contraseña = ? WHERE id_usuario = ?", [newHash, usuario.id_usuario])
        }
      }

      if (!isValidPassword) {
        throw new Error("Contraseña incorrecta")
      }

      // Generar token JWT
      const tokenPayload = {
        id_usuario: usuario.id_usuario,
        correo_usuario: usuario.correo_usuario,
        id_rol: usuario.id_rol,
      }

      const token = this.createJWT(tokenPayload)

      // Remover la contraseña del objeto usuario antes de devolverlo
      const { contraseña, ...usuarioSinPassword } = usuario

      return {
        usuario: usuarioSinPassword as Usuario,
        token,
      }
    } catch (error) {
      console.error("Error during login:", error)
      throw error
    }
  }

  // Registrar nuevo usuario
  static async register(registerData: RegisterData): Promise<{ usuario: Usuario; token: string }> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.getUserByEmail(registerData.correo_usuario)
      if (existingUser) {
        throw new Error("El correo electrónico ya está registrado")
      }

      // Hashear la contraseña
      const hashedPassword = await this.hashPassword(registerData.contraseña)

      // Insertar nuevo usuario (por defecto rol 2 = user)
      const query = `
        INSERT INTO usuario (nombre, direccion_usuario, correo_usuario, contraseña, id_rol)
        VALUES (?, ?, ?, ?, ?)
      `

      const params = [
        registerData.nombre,
        registerData.direccion_usuario,
        registerData.correo_usuario,
        hashedPassword,
        registerData.id_rol || 2, // Por defecto rol 2 (user)
      ]

      const result = (await executeQuery(query, params)) as any
      const newUserId = result.insertId

      // Obtener el usuario recién creado
      const newUser = await this.getUserById(newUserId)
      if (!newUser) {
        throw new Error("Error al crear usuario")
      }

      // Generar token JWT
      const tokenPayload = {
        id_usuario: newUser.id_usuario,
        correo_usuario: newUser.correo_usuario,
        id_rol: newUser.id_rol,
      }

      const token = this.createJWT(tokenPayload)

      return {
        usuario: newUser,
        token,
      }
    } catch (error) {
      console.error("Error during registration:", error)
      throw error
    }
  }

  // Verificar token JWT
  static verifyToken(token: string): { id_usuario: number; correo_usuario: string; id_rol: number } | null {
    try {
      const decoded = this.verifyJWT(token) as DecodedToken
      if (!decoded) return null

      return {
        id_usuario: decoded.id_usuario,
        correo_usuario: decoded.correo_usuario,
        id_rol: decoded.id_rol,
      }
    } catch (error) {
      console.error("Error verifying token:", error)
      return null
    }
  }

  // Actualizar información del usuario
  static async updateUser(userId: number, updateData: Partial<Usuario>): Promise<Usuario> {
    try {
      // Remover campos que no se deben actualizar
      const { id_usuario, id_rol, ...fieldsToUpdate } = updateData

      // Construir query dinámicamente
      const fields = Object.keys(fieldsToUpdate).filter((key) => {
        const value = fieldsToUpdate[key as keyof typeof fieldsToUpdate]
        return value !== undefined && value !== null && value !== ""
      })

      if (fields.length === 0) {
        throw new Error("No hay campos para actualizar")
      }

      const setClause = fields.map((field) => `${field} = ?`).join(", ")
      const values: any[] = fields.map((field) => fieldsToUpdate[field as keyof typeof fieldsToUpdate])

      const query = `UPDATE usuario SET ${setClause} WHERE id_usuario = ?`
      values.push(userId)

      await executeQuery(query, values)

      // Obtener el usuario actualizado
      const updatedUser = await this.getUserById(userId)
      if (!updatedUser) {
        throw new Error("Error al actualizar usuario")
      }

      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error)
      throw new Error("Error al actualizar usuario")
    }
  }

  // Obtener rol del usuario
  static async getUserRole(userId: number): Promise<string | null> {
    try {
      const query = `
        SELECT r.nombre_roles 
        FROM usuario u 
        JOIN rol r ON u.id_rol = r.id_rol 
        WHERE u.id_usuario = ?
      `
      const results = (await executeQuery(query, [userId])) as any[]

      if (results.length === 0) {
        return null
      }

      return results[0].nombre_roles
    } catch (error) {
      console.error("Error fetching user role:", error)
      return null
    }
  }
}
