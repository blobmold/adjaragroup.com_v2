import Article from "../models/Article.js";

export default async (req, res) => {
  // Sort articles by year (descending)
  let articles = await Article
  .find(req.query, {body: 0})
  .limit(10)
  .sort({ postDate: -1 });
  
  const featuredArticles = await Article
  .find({}, {body: 0})
  .sort({ postDate: -1 })
  .limit(3);

  const articleCategories = await Article.distinct("category");

  res.render("newsroom", {
    title: "Newsroom",
    articles,
    featuredArticles,
    articleCategories,
  });
};
