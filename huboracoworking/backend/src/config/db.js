import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("ENV CHECK:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
});

export default pool;

// ✅ Test de conexión (temporal)
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ DB conectada correctamente");
  } catch (error) {
    console.error("❌ Error conectando DB:", error);
  }
})();
