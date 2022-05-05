import Career from "../models/Career.js";

export default async (req, res) => {
  let careers = await Career.find({});

  if (careers.length === 0) careers = `No jobs available`;

  res.render("careers", {
    careers,
  });
};
