import Article from "../models/Article.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (req, res) => {
  let image = await req.files.image;
  await image.mv(resolve(__dirname, "../public/assets/img/articles", image.name));
  await Article.create({
    ...req.body,
    image: '/assets/img/articles/' + image.name,
  });

  res.redirect('/')
};
