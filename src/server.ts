const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
import { PoolClient } from "pg";
import { decrypt } from "./crypto";

// Middleware
app.use(bodyParser.json());

app.use(cors()); // Enable CORS for all routes

// Routes
// Define your API routes here
app.post("/signup", (req: any, res: any) => {
  const data = req.body;
  const password = decrypt(data.password);
  res.json(data);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  // const connection: PoolClient = await db.connect();
  // const response = await connection.query("select * from user_info;");
  // console.log(response);
  // connection.release();
});
