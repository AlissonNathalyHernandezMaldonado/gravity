import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gravity",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

// Obtener conexión
export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

// Ejecutar consulta
export async function executeQuery<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const connection = await getConnection()
  try {
    const [results] = await connection.execute(sql, params)
    return results as T[]
  } finally {
    await connection.end()
  }
}
