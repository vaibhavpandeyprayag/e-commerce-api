const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());

app.use(cors()); // Enable CORS for all routes

// Routes
// Define your API routes here
app.get("/api/data", (req, res) => {
  // Replace this with your actual data or logic to fetch data
  const data = {
    message: "Hello from the server!",
    value: 42,
  };

  // Sending JSON response
  res.json(data);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
