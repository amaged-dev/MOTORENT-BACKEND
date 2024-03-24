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
    type: String,
    enum: ['solved', 'pending'],
    default: 'pending',
  },
  attachments: {
    id: {
      type: String
    },
    url: {
      type: String
    },
  },
  replay: {
    type: String,
  },
  seen:{
    type: Boolean,
    default: false
  }
},{
  timestamps: true,

});

const Message = mongoose.model("Message", messageSchema);

export default Message;
