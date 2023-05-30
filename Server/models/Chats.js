const mongoose = require("mongoose");

const ChatsSchema = new mongoose.Schema(
  {
    EmployeeID1: { type: Number , required: true},
    EmployeeID2: { type: Number , required: true},
    Messages: { type: [Object] }
  },
 
);

ChatsSchema.index({ EmployeeID1: 1, EmployeeID2: 1 }, { unique: true });

const Chats=mongoose.model("Chats",ChatsSchema);
module.exports = Chats;