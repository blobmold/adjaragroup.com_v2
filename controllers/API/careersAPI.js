import Career from "../../models/Career.js";
import express from "express";

let router = express.Router();

router.get("/api/careers", async(req, res) => {
  try {
    let careers = await Career.find(req.query);
    res.status(201);
    res.send(careers);
  } catch (error) {
    res.status(500);
    res.render("500");
  }
});

export default router;