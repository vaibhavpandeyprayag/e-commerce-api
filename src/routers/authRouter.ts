import express, { Response } from "express";
import { PoolClient } from "pg";
import db from "../db/db";
import { decrypt } from "../crypto";
import jwt from "jsonwebtoken";
import { ServerResponse } from "http";
import { APIResponse } from "../types";

const authRouter = express.Router();
const SECRET_KEY = process.env.SECRET_KEY as string;

authRouter.post("/signup", async (req, res) => {
  let connection: PoolClient | undefined = undefined;
  try {
    const { firstname, lastname, email, password } = req.body;
    connection = await db.connect();
    let query = `insert into user_auth_info (email, password) values ('${email}', '${password}');`;
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

authRouter.post("/login", async (req, res) => {
  let connection: PoolClient | undefined = undefined;
  try {
    const { email, password } = req.body;
    connection = await db.connect();
    let query = `select id, password from user_auth_info where email = '${email}'`;
    console.log("login query >>", query);
    const dbResponse = await connection.query(query);
    console.log(dbResponse);
    if (dbResponse.rowCount > 0) {
      const userId = dbResponse.rows[0].id;
      const passwordFromDb = dbResponse.rows[0].password;
      if (decrypt(password) === decrypt(passwordFromDb)) {
        const loginToken = jwt.sign({ id: userId }, SECRET_KEY);
        let response: APIResponse = {
          message: "Logged in successfully",
          data: { user: loginToken },
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

export default authRouter;
