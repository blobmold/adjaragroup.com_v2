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
  description: {
    type: String,
    default: `${this.location} is pleased to announce an opening for the position ${this.position}`
  },
  remote: Boolean,
  salary: {
    type: Number,
    default: `N/A`
  }
});

const Career = mongoose.model("Careers", CareerSchema);

export default Career;
