import { Pool } from "pg";
require("dotenv").config();

// const pool = new Pool({
//   host: process.env.POSTGRESQL_ADDON_HOST,
//   database: process.env.POSTGRESQL_ADDON_DB,
//   user: process.env.POSTGRESQL_ADDON_USER,
//   port: Number(process.env.POSTGRESQL_ADDON_PORT),
//   password: process.env.POSTGRESQL_ADDON_PASSWORD,
// });
const pool = new Pool({
  host: "localhost",
  database: "ecommerce",
  user: "postgres",
  port: 5432,
  password: process.env.LOCALPASS,
});

export default pool;
