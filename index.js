require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");

app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("uploads"));
app.use(cors());

// Routes
const userRoute = require("./routes/user");
const storeRoute = require("./routes/store");
const userClockInRoute = require("./routes/userClockIn");

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_URL,
  user: "root",
  password: "zaq@XSW2345",
  database: "store",
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the MySQL database:", err);
    return;
  }
  console.log("Connected to the MySQL database!");
});

app.get("/", function (req, res) {
  res.status(200).json({
    msg: "Welcome to nodejs",
  });
});

app.use("/api/user", userRoute);
app.use("/api/store", storeRoute);
app.use("/api/clock-in", userClockInRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
