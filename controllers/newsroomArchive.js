import Article from "../models/Article.js";

export default async (req, res) => {
  const articles = await Article.find({}).sort({postDate: -1});

  let map = new Map();

  for (let article of articles) {
    let postDate = article.postDate.getFullYear();

    // If map object does not contain the given date, create one and push
    if (!map.has(postDate)) map.set(postDate, []);

    // otherwise find and push
    map.get(postDate).push(article);
  }

  res.render("newsroomArchive", {
    title: "Newsroom Archive",
    sortedArticles: new Map([...map.entries()].sort().reverse()),    // Sort articles by year (descending)
  });
};
