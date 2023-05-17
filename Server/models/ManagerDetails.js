const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    fname: { type: String },
    lname: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    userType: { type: String },
    address: { type: String },
    salary: { type: Number },
    image: { type: String }
    
  },
  {
    collection: "EmployeeInfo",
  }
);

const EmployeeInfo=mongoose.model("EmployeeInfo", UserDetailsScehma);
module.exports = EmployeeInfo;