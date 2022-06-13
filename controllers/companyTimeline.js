import fs from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (req, res) => {
  let readCompanyTimeline = await fs.readFile(resolve(__dirname, "../config/ag-timeline.json"));
  let companyTimeline = JSON.parse(readCompanyTimeline);
  res.render("companyTimeline", { title: "AG Timeline", companyTimeline });
};
