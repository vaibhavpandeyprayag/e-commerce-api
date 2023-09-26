import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { APIResponse } from "./types";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const SECRET_KEY = process.env.SECRET_KEY as string;

  try {
    const token = req.header("Authorization");
    if (token === undefined) {
      let response: APIResponse = { message: "Authorization failed" };
      res.status(400).send(response);
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log(decoded);
    let response: APIResponse = { message: "Already loggin in" };
    res.status(200).send(response);
  } catch (error) {
    let response: APIResponse = { message: "Session exprired" };
    res.status(401).send(response);
  }
};
