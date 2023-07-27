const express = require("express");
const sessionConfig = require("./routes/session.config");
const hbs = require("hbs");
const app = express();
require("dotenv/config");

// Other required imports and configurations
// ...

// Connect to the database
require("./db");

// Set up session configuration
sessionConfig(app);
require("./config")(app);
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// Other middleware configurations and routes
// ...

// Use the authRoutes from authRoutes.js\
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

require("./error-handling")(app);

module.exports = app;
