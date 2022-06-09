import Article from "../models/Article.js";

export default async (req, res) => {
  const articles = await Article.find({}).sort({createdAt: -1});

  let map = new Map();

  for (let article of articles) {
    let createdAt = article.createdAt.getFullYear();

    // If map object does not contain the given date, create one and push
    if (!map.has(createdAt)) map.set(createdAt, []);

    // otherwise find and push
    map.get(createdAt).push(article);
  }

  res.render("newsroomArchive", {
    title: "Newsroom Archive",
    sortedArticles: new Map([...map.entries()].sort().reverse()),    // Sort articles by year (descending)
  });
};
