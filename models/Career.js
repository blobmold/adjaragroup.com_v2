import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CareerSchema = new Schema({
  category: String,
  position: String,
  location: String,
  employmentType: {
    type: String,
    default: "Full-time",
  },
  postDate: {
    type: Date,
    default: new Date().toLocaleDateString(),
  },
  deadline: Date,
  description: {
    type: String,
    default: `${this} is pleased to announce an opening for the position ${this}`
  },
  remote: Boolean,
  salary: {
    type: Number,
    default: `N/A`
  }
});

const Career = mongoose.model("Careers", CareerSchema);

export default Career;
