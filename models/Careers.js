import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CareerSchema = new Schema({
  category: String,
  position: String,
  location: String,
  employmentType: String,
  postDate: {
    type: Date,
    default: new Date().toDateString(),
  },
  deadline: Date,
  remote: Boolean,
});

const Career = mongoose.model("Careers", CareerSchema);

export default Career;
