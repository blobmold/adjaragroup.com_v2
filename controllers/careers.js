import Career from "../models/Career.js";

export default async (req, res) => {
  try {
    let careers = await Career.find(req.query).sort({
      postDate: -1,
    });

    let totalLen = await Career.find().count();

    let careerCategories = await Career.aggregate([ 
      { $group: { _id: "$category", count: { $count: {} } } },
      { $sort: {
        '_id': 1
      } }
    ]);

    res.render("careers", {
      careers,
      totalLen,
      careerCategories
    });

  } catch (error) {

    console.log(error);
    res.render("404", {
      message: error.message,
      error,
    });
  }
};
