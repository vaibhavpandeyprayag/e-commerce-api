import express from "express";
import { PoolClient } from "pg";
import db from "../db/db";
import { decrypt } from "../crypto";
import jwt from "jsonwebtoken";
import { APIResponse } from "../types";
import { verifyJWT } from "../middlewares";

const authRouter = express.Router();
const SECRET_KEY = process.env.SECRET_KEY as string;

authRouter.post("/auth/signup", async (req, res) => {
  let connection: PoolClient | undefined = undefined;
  try {
    const { firstname, lastname, email, password } = req.body;
    connection = await db.connect();
    let query = `insert into public.users (name, email, password) values ('Vaibhav Pandey', '${email}', '${password}');`;
    console.log("signup query >>", query);
    const dbResponse = await connection.query(query);
    console.log(dbResponse);
    let response: APIResponse = {
      message: "Account created successfully.",
    };
    res.status(201).send(response);
  } catch (error) {
    console.error(error);
    let response: APIResponse = {
      message: "Internal Server Error",
    };
    res.status(500).send(response);
  } finally {
    if (connection != undefined) connection.release();
  }
});

authRouter.post("/auth/login", async (req, res) => {
  let connection: PoolClient | undefined = undefined;
  try {
    const { email, password } = req.body;
    connection = await db.connect();
    let query = `select * from public.users where email = '${email}'`;
    console.log("login query >>", query);
    const dbResponse = await connection.query(query);
    console.log(dbResponse);
    if (dbResponse.rowCount > 0) {
      const userId = dbResponse.rows[0].id;
      const passwordFromDb = dbResponse.rows[0].password;
      const firstname = dbResponse.rows[0].firstname;
      if (decrypt(password) === decrypt(passwordFromDb)) {
        const loginToken = jwt.sign({ id: userId }, SECRET_KEY, {
          expiresIn: "3600s",
        });
        let response: APIResponse = {
          message: "Logged in successfully",
          data: {
            user: { token: loginToken, id: userId, firstname: firstname },
          },
        };
        res.status(200).send(response);
      } else {
        let response: APIResponse = {
          message: "Invalid credentials",
        };
        res.status(401).send(response);
      }
    } else {
      let response: APIResponse = {
        message: "Invalid credentials",
      };
      res.status(401).send(response);
    }
  } catch (error) {
    console.error(error);
    let response: APIResponse = {
      message: "Internal Server Error",
    };
    res.status(500).send(response);
  } finally {
    if (connection != undefined) connection.release();
  }
});

authRouter.post("/auth/verifyJwt", verifyJWT, async (req, res) => {
  let response: APIResponse = { message: "User verified" };
  res.status(200).send(response);
});

export default authRouter;
