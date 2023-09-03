import { Pool } from "pg";
require("dotenv").config();

const pool = new Pool({
  host: process.env.POSTGRESQL_ADDON_HOST,
  database: process.env.POSTGRESQL_ADDON_DB,
  user: process.env.POSTGRESQL_ADDON_USER,
  port: Number(process.env.POSTGRESQL_ADDON_PORT),
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
});
pool.connect((err: any) => {
  if (err) throw err;
  console.log("Connected!");
});

export default pool;
