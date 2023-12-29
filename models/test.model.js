const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  questionPaper: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "QuestionPaper",
    // length: 20,
  },
  answers: {
    type: [String],
    // length: 20,
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

module.exports = mongoose.model("Test", testSchema);