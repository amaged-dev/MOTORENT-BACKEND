import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "The message should belong to user"],
  },
  title: {
    type: String,
    required: [true, "message should have title"],
  },
  body: {
    type: String,
    required: [true, "message should have body"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
