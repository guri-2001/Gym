const mongoose = require("mongoose");

const ImageScehma = new mongoose.Schema({
    image: {
        type: String,
    },

    createdAt: { type: Date, default: Date.now }
});


// create model

const Gallery = new mongoose.model("Gallery", ImageScehma);

module.exports = Gallery;