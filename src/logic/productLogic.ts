import { decrypt } from "../crypto";
import express from "express";
import { Pool, PoolClient } from "pg";
import jwt from "jsonwebtoken";
import db from "../db/db";
import { APIResponse } from "../types";
import { verifyJWT } from "../middlewares";

const productRouter = express.Router();
const SECRET_KEY = process.env.SECRET_KEY as string;

productRouter.get("/getCategories", async (req, res) => {
  let connection: PoolClient | undefined = undefined;
  try {
    connection = await db.connect();
    let query = `select * from public.product_categories order by name;`;
    console.log("categories query >>", query);
    const dbResponse = await connection.query(query);
    console.log(dbResponse);
    if (dbResponse.rowCount > 0) {
      let response: APIResponse = {
        data: dbResponse.rows,
        message: "Product categories fetched",
      };
      res.status(200).send(response);
    } else {
      let response: APIResponse = {
        message: "No categories found",
      };
      res.status(204).send(response);
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

productRouter.get("/getSubcategories", async (req, res) => {
  let connection: PoolClient | undefined = undefined;

  try {
    connection = await db.connect();
    let query = `select * from public.product_subcategories order by name;`;
    const dbResponse = await connection.query(query);
    console.log(dbResponse);
    if (dbResponse.rowCount > 0) {
      let response: APIResponse = {
        data: dbResponse.rows,
        message: "Product subcategories fetched",
      };
      res.status(200).send(response);
    } else {
      let response: APIResponse = {
        message: "Product subcategories not found",
      };
      res.status(204).send(response);
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

export default productRouter;
