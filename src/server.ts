import express from "express";
import authRouter from "./logic/authLogic";
import productRouter from "./logic/productLogic";
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json()); // parse application/json
app.use(cors()); // Enable CORS for all routes

// Routes
// Define your API routes here
app.use("/", [authRouter, productRouter]);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});
