const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    fname: { type: String },
    lname: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    IsLogin: { type: Number },
    image: { type: String }
  },
  {
    collection: "ManagerInfo",
  }
);

const ManagerInfo=mongoose.model("ManagerInfo", UserDetailsScehma);
module.exports = ManagerInfo;