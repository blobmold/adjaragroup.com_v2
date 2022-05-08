import User from "../models/User.js";

export default async (req, res, next) => {
  let user = await User.findById(req.session.userId);
  if (!user) {
    console.log("Not logged in");
    return res.redirect("/");
  }
  next();
};