import Career from "../models/Career.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (req, res) => {
  try {
    let careers = await Career.find(req.query);

    let careerCategories = await fs.readFile(path.resolve(__dirname, "../config/careerCategories.json"));

    res.render("careers", {
      careers,
      careerCategories: JSON.parse(careerCategories),
    });

  } catch (error) {
    console.log(error);
    res.render("404", {
      message: error.message,
      error,
    });
  }
};
