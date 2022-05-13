import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import expressSession from "express-session";
import compression from "compression";

const app = express();
app.disable("x-powered-by");

// Database
mongoose.connect("mongodb://127.0.0.1/AdjaraGroup");

app.set("view engine", "ejs");

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  expressSession({
    secret: "aggpbicmac",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(compression());

global.loggedIn = null;

app.use("*", (req, res, next) => {
  global.loggedIn = req.session.userId;
  next();
});

import navigationMiddleware from "./middleware/navigation.js";
app.use(navigationMiddleware);

// Routes
// User pages
import homeCtrl from "./controllers/home.js";
import companyCtrl from "./controllers/company.js";
import hotelsCtrl from "./controllers/hotels.js";
import restaurantsCtrl from "./controllers/restaurants.js";
import developmentCtrl from "./controllers/development.js";
import agricultureCtrl from "./controllers/agriculture.js";
import sitemapCtrl from "./controllers/sitemap.js";
import privacyCtrl from "./controllers/privacy.js";
import newsroomCtrl from "./controllers/newsroom.js";
import newsroomArchiveCtrl from "./controllers/newsroomArchive.js";
import articleCtrl from "./controllers/article.js";
import careersCtrl from "./controllers/careers.js";

app.get("/", homeCtrl);
app.get("/company", companyCtrl);
app.get("/hotels", hotelsCtrl);
app.get("/restaurants", restaurantsCtrl);
app.get("/development", developmentCtrl);
app.get("/agriculture", agricultureCtrl);
app.get("/sitemap", sitemapCtrl);
app.get("/privacy", privacyCtrl);
app.get("/newsroom", newsroomCtrl);
app.get("/newsroom/archive", newsroomArchiveCtrl);
app.get("/newsroom/:id", articleCtrl);
app.get("/careers", careersCtrl);

import articleAPICtrl from "./controllers/articleAPI.js";
app.use(articleAPICtrl);

// Admin pages
import userCtrl from "./controllers/user.js";
app.use(userCtrl);

// 404
app.use(async (req, res, next) => {
  res.status(404);
  res.render("404");
  next();
});

// 500
app.use(async (err, req, res, next) => {
  res.render("500", {
    message: err.message,
    error: err,
  });
  next();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server successfully running on http://localhost:${PORT}; Press Ctrl + c to terminate.`);
});
