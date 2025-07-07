const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_CON;

mongoose.connect(mongoUrl)
.then(()=>{
    console.log("MongoDb Connected Successfully");
})
.catch((err)=>{
    console.log("MongoDb Connection Error", err);
})