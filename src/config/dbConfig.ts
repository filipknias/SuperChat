import { Pool } from "pg";

const port: number = parseInt(<string>process.env.PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port,
  database: process.env.DB_DATABASE,
});

export default pool;
