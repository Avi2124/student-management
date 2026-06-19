import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 4000,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: {
        rejectUnauthorized: false
    }
});
console.log("MySQL Connected");
export default pool;
