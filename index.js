require('dotenv').config();   //to use .env things
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const{userRouter}=require("./routes/user");
const{courseRouter}=require("./routes/course");
const{adminRouter}=require("./routes/admin");
app.use(express.json());

app.use('/api/v1/user',userRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/admin',adminRouter)

async function main() {
    await mongoose.connect(process.env.mongo_url);
    console.log("connected to port 3000");
    app.listen(3000)

}
main();


