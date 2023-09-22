import express from "express";
import { PoolClient } from "pg";
import db from "../db/db";
import { decrypt } from "../crypto";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const connection: PoolClient = await db.connect();

  let query = `insert into user_auth_info (email, password) values ('${email}', '${password}');`;
  console.log("signup query >>", query);
  const response = await connection.query(query);
  console.log(response);
  res
    .status(201)
    .send({ status: 201, message: "Account created successfully." });

  connection.release();
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const connection: PoolClient = await db.connect();

  let query = `select password from user_auth_info where email = '${email}';`;
  console.log("login query >>", query);
  const response = await connection.query(query);
  console.log(response);
  if (response.rowCount > 0) {
    const passwordFromDb = response.rows[0].password;
    if (decrypt(password) === decrypt(passwordFromDb))
      res.status(200).send({ status: 200, message: "Logged in successfully." });
    else res.status(401).send({ status: 401, message: "Invalid credentials." });
  } else res.status(401).send({ status: 401, message: "Invalid credentials." });
});

export default authRouter;
