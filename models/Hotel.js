import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  property: String,
  logoBlack: String,
  logoWhite: String,
  image: String
});

const Hotel = mongoose.model("Hotel", HotelSchema);

export default Hotel;
