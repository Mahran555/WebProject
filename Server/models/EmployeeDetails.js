const mongoose = require("mongoose");
const UserDetailsScehma = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    fname: { type: String , required: true},
    lname: { type: String , required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String , required: true},
    address: { type: String , required: true },
    salary: { type: Number , required: true },
    image: { type: String , required: true}
  },
  {
    collection: "EmployeeInfo",
  }
);

const EmployeeInfo=mongoose.model("EmployeeInfo", UserDetailsScehma);
module.exports = EmployeeInfo;