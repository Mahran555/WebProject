const mongoose = require("mongoose");
const saveSchedule = new mongoose.Schema(
    {
      EmployeeID: { type: Array, required: true},
      day: { type: Number },
      month: { type: Number},
      shift: { type: String },
      
    },
    {
      collection: "Shifts",
    }
  );
  const Shifts=mongoose.model("Shifts", saveSchedule);
  module.exports = Shifts;