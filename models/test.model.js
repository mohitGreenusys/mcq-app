import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
    length: 20,
  },
  answers: {
    type: [String],
    length: 20,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  score: {
    type: Number,
    default: 0,
  },
  currentQuestion: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  currentTimer: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Test", testSchema);