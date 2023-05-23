const mongoose = require("mongoose");
const vacationReq = new mongoose.Schema(
    {
      id: { type: Number},
      status: { type: String,default:"pending" },
      dayFrom: { type: Number },
      dayTo: { type: Number },
      fname:{type: String},
      lname:{type: String},
      monthFrom: { type: Number},
      monthTo: { type: Number},
      reason:{type:String},
      
    },
    {
      collection: "VacationRequests",
    }
  );
  const VacationRequests=mongoose.model("VacationRequests", vacationReq);
  module.exports = VacationRequests;