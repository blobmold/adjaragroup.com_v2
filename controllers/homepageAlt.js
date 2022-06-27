import Article from "../models/Article.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default async (req, res) => {
  const recentArticles = await Article.find({}).sort({ createdAt: -1 }).limit(3);

  let readHomeContent = await fs.readFile(path.resolve(__dirname, "../config/homepageAlt.json"));
  let homeContent = JSON.parse(readHomeContent);

  res.render("homepageAlt", {
    recentArticles,
    homeContent,
  });
};
