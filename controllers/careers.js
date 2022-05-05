import Career from "../models/Career.js";

export default async (req, res) => {
  const careers = await Career.find({});

  res.render("careers", {
    careers,
  });
};
