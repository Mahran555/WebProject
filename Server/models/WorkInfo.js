const mongoose = require("mongoose");

const workDetailsScehma = new mongoose.Schema(
  {
    EmployeeID: { type: Number , required: true, unique: true},
    January: {type: Array},
    February: {type: Array},
    March: {type: Array},
    April: {type: Array},
    May:{type: Array}
 
  },
  {
    collection: "WorkInfo",
  }
);

const WorkInfo=mongoose.model("WorkInfo",workDetailsScehma);
module.exports = WorkInfo;