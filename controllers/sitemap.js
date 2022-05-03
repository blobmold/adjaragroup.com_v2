import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export default async (req, res) => {
    let readSitemap = await fs.readFile(path.resolve(__dirname, "../config/sitemap.json"))
    let siteMap = JSON.parse(readSitemap);
    res.render('sitemap', {
        siteMap
    })
}