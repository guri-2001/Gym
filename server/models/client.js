const mongoose = require("mongoose");

// const IMAGEPATH = 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg'


const ClientDetailsScehma = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
    },
    mobileno: {
        type: String,
    },
    dob: {
        type: Date,
    },
    weight: {
        type: Number,
    },
    address: {
        type: String,
    },
    image: {
        type: String,
        // default: '/uploads/default.png',
    },
    fees: {
        type: String,
        default: " "
    },
    duration: {
        type: String,
        default: " "
    },
    enddate: {
        type: String,
        default: " "
    },
    checkedValues: [String],
    status: {
        type: Boolean,
        default: true,
    },
    createdAt: { type: Date, default: Date.now }
});


// create model

const Client = new mongoose.model("gymclients", ClientDetailsScehma);

module.exports = Client;