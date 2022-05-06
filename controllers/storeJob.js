import Career from "../models/Career.js";
// import { dirname, resolve } from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export default async (req, res) => {
  await Career.create({
    ...req.body,
  });

  res.redirect('/careers');
};
