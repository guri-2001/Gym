const mongoose = require("mongoose");


mongoose.connect('mongodb+srv://Zenith:zenith1234@gym.gbjxh.mongodb.net/Zenith?retryWrites=true&w=majority&appName=Gym',{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>console.log("DATABASE connected")).catch((err)=> console.log("error" + err.message))