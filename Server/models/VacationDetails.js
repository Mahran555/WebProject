const mongoose = require("mongoose");
const vacationReq = new mongoose.Schema(
    {
      id: { type: Number},
      status: { type: String },
      dayFrom: { type: Number },
      dayTo: { type: Number },
      fname:{type: String},
      lname:{type: String},
      monthFrom: { type: Number},
      monthTo: { type: Number},
      
    },
    {
      collection: "VacationRequests",
    }
  );
  const VacationRequests=mongoose.model("VacationRequests", vacationReq);
  module.exports = VacationRequests;