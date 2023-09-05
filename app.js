const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser');

require("dotenv").config({ path: "config/config.env" });

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Importing Routes
const routes = require("./routes/routes");

// Using Routes
app.use("/api/v1", routes);
module.exports = app;
