const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.routes');
const adminRouter = require('./routes/admin.routes');

const app = express();

dotenv.config("./.env");

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/user",userRouter);

app.use("/admin",adminRouter);

app.use("/",(req,res)=>{
    res.send("i am alive buddy 😊");
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})

mongoose.connect(process.env.MONGODB_URI,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(()=>{
    console.log(`database connected successfully`);
})