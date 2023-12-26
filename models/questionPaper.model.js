const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
    questions:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Question",
        length:20,
    },
    time:{
        type:Number,
        default:0,
    },
    difficulty:{
        type:String,
        default:"easy",
        enum:["easy","medium","hard"],
    },
    status:{
        type:String,
        default:"active",
        enum:["active","inactive"],
    },
    attempts:{
        type:Number,
        default:0,
    },
    createdAT:{
        type:Date,
        default:Date.now,
    },
})

module.exports = mongoose.model("QuestionPaper",questionPaperSchema);