import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// UserSchema.pre("save", function (next) {
//   bcrypt.hash(this.password, 10, (error, hash) => {
//     this.password = hash;
//     next();
//   });
// });

UserSchema.pre("save", async (next) => {
  let hash = await bcrypt.hash(this.passowrd, 10);
  this.password = hash;
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
