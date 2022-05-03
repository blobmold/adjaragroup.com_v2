import path from "path"
import fs from 'fs/promises'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async (req, res, next) => {
    let a = ['gn', 'gf'];
    for (let file of a) {
        let readFile = await fs.readFile(path.resolve(__dirname, `../config/${file}.json`));
        let f = JSON.parse(readFile);
        res.locals[file] = f;
    }
    next()
}
