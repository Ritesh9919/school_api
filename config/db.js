import dotenv from 'dotenv'
dotenv.config();
import mysql from 'mysql2/promise'


const pool = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE_NAME,
    port:process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})


export {pool}