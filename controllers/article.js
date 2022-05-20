import Article from "../models/Article.js";

export default async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    const relatedArticles = await Article.find({
      category: article.category,
      // Not Including the article that is currently being viewed
      _id: {
        $ne: req.params.id,
      },
    })
      .limit(6)
      .sort({ postDate: -1 });

    const articleCategories = await Article.distinct("category");

    res.render("article", {
      title: article.title,
      article,
      relatedArticles,
      articleCategories,
    });
  } catch (error) {
    console.log(error);
    res.render("404", {
      message: error.message,
      error,
    });
  }
};
