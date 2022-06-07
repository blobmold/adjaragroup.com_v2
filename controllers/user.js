import { Router } from "express";
import fs from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Article from "../models/Article.js";
import Career from "../models/Career.js";
import authMiddleware from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let router = Router();

// Register
router.post("/users/register", async (req, res) => {
  try {
    await User.create(req.body);
    console.log("New user created");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    console.log("User not created");
    res.redirect("/users/register");
  }
});

// Login
router.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    let same = bcrypt.compare(password, user.password);
    if (same) {
      req.session.userId = user._id;
      console.log(req.session, "User Logged In");
      res.redirect("/");
    } else {
      console.log("User not created");
      res.redirect("/auth/login");
    }
  }
});

// Login page
router.get("/auth/login", async (req, res) => {
  res.render("login");
});

// Register page
router.get("/auth/register", async (req, res) => {
  res.render("register");
});

// Logout
router.get("/auth/logout", async (req, res) => {
  req.session.destroy();
  console.log(req.session);
  res.redirect("/");
});

// Create a new article (page)
router.get("/articles/new", authMiddleware, async (req, res) => {
  res.render("newArticle");
});

// Store a new article
router.post("/articles/store", async (req, res) => {
  let image = req.files.image;

  // Sharp takes a buffer therefore data is being passed
  await sharp(req.files.image.data)
    .resize(250, 130)
    .toFile(resolve(__dirname, "../public/assets/img/articles", `${image.name}-250x130.jpeg`));

  await image.mv(resolve(__dirname, "../public/assets/img/articles", image.name));
  await Article.create({
    ...req.body,
    image: "/assets/img/articles/" + image.name,
    imageSmall: "/assets/img/articles/" + `${image.name}-250x130.jpeg`
  });

  res.redirect("/");
});

// Create a new job posting (page)
router.get("/careers/new", authMiddleware, async (req, res) => {
  const jobCategories = await fs.readFile(resolve(__dirname, "../config/careerCategories.json"));

  res.render("newJob", {
    jobCategories: JSON.parse(jobCategories),
  });
});

// Store new job
router.post("/careers/store", async (req, res) => {
  await Career.create({
    ...req.body,
  });

  res.redirect("/careers");
});

export default router;
