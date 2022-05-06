import fs from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (req, res) => {
  const jobCategories = await fs.readFile(resolve(__dirname, "../config/careerCategories.json"));


  res.render('newJob', {
    jobCategories: JSON.parse(jobCategories),
  });
};