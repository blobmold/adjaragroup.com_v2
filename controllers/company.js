import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default async (req, res) => {

  let readCompanyContent = await fs.readFile(path.resolve(__dirname, "../config/company.json"));
  let companyContent = JSON.parse(readCompanyContent);

  res.render("company", {
    title: "Company",
    companyContent
  });
};
