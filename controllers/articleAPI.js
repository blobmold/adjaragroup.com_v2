"use strict";

import Article from "../models/Article.js";
import express from "express";

let router = express.Router();

router.get("/api/articles", async (req, res) => {
  try {
    let articles = await Article.find(req.query);
    res.status(201);
    res.send(articles);
  } catch (error) {
    res.status(500);
    res.render("500");
  }
});

router.get("/api/articles/list", async (req, res) => {
  let pageType = "list";
  let pageNum = await getPageNum();
  let pageSize = 10;
  let totalCount = await Article.find(req.query, {body: 0}).count();

  async function getPageNum() {
    let num = Number(req.query.pageNum)
    if(!num) return num = 1
    return num;
  }

  let articlesModified = {
    articles: await Article.find(req.query, {body: 0})
      .sort({postDate: -1})
      .limit(pageSize)
      .skip(pageNum * pageSize - pageSize),
    pageType,
    pageNum,
    pageSize,
    totalCount,
  };

  res.status(201);
  res.send(articlesModified);
});

router.get("/api/articles/:id", async (req, res) => {
  let article = await Article.findOne({ _id: req.params.id });
  res.send(article);
});

export default router;