import express from "express";
import { PoolClient } from "pg";
import db from "../db/db";
import { APIResponse } from "../types";

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

productRouter.get("/product/:id", async (req, res) => {
  let connection: PoolClient | undefined = undefined;
  const { id } = req.params;
  try {
    let query = `select prod.*, cat.name as category_name, cat.title as category_title, subcat.name as subcategory_name, subcat.title as subcategory_title from public.products prod
                 left join public.product_categories cat on prod.category_id = cat.id
                 left join public.product_subcategories subcat on prod.subcategory_id = subcat.id
                 where prod.id = ${id}`;
    connection = await db.connect();
    const dbResponse = await connection.query(query);
    if (dbResponse.rowCount > 0) {
      let response: APIResponse = {
        data: dbResponse.rows[0],
        message: "Product found",
      };
      res.status(200).send(response);
    } else {
      let response: APIResponse = { message: "No such product found" };
      res.status(204).send(response);
    }
  } catch (error) {
    console.error(error);
    let response: APIResponse = { message: "Internal Server Error" };
    res.status(500).send(response);
  } finally {
    if (connection != undefined) connection.release();
  }
});

export default productRouter;
