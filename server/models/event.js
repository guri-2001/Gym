const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    title: { type: String },
    start: { type: String },
    // end: { type: String },
})


const Event = mongoose.model('Event', EventSchema);

module.exports = Event;