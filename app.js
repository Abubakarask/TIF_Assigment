const express = require("express");
const app = express();
const path = require("path");
const SNOWFLAKE = require("@theinternetfolks/snowflake");
// "@theinternetfolks/snowflake";

require("dotenv").config({ path: "config/config.env" });

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing Routes
const routes = require("./routes/routes");

// Using Routes
app.use("/api/v1", routes);
console.log(
  SNOWFLAKE.Snowflake.generate({ timestamp: 1649157035498, shard_id: 4 })
);

module.exports = app;
