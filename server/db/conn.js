const mongoose = require("mongoose");

// const DB = "mongodb+srv://codecrafters:Devteam2024@data.ma9zn4r.mongodb.net/companyRecords?retryWrites=true&w=majority&appName=data"
// const DB = process.env.MONGODB_URL

// console.log(DB);


mongoose.connect('mongodb+srv://codecrafters:Devteam2024@data.ma9zn4r.mongodb.net/companyRecords?retryWrites=true&w=majority&appName=data',{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>console.log("DATABASE connected")).catch((err)=> console.log("error" + err.message))