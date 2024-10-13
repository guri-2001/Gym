const express = require('express');
const path = require('path');
const router = require('./routes/router');
require("./db/conn");
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());
const crossOrigin = {
    origin: 'zenithgym.vercel.app',
    credentials: true
}
app.use(cors(crossOrigin));
app.use(express.urlencoded({ extended: true }));


// Serve static files (for accessing uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(router);

app.get('/', function(req, res) {
    res.json({message: "Sucessfully"})
})

app.listen(port, () => {
    console.log(`server start at port no ${port}`)
})
