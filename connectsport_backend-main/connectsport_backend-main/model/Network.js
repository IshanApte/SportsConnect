const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User' }, // Assuming 'User' is the model name
    friends: [{ type: String }],
    blocked: [{ type: String }],
    reqSent: [{ type: String }],
    reqReceived: [{ type: String }],
    pages_following: [{ type: String }]
}, {
    collection: "networks" // Collection names are typically lowercase
});

module.exports = mongoose.model("Network", networkSchema);
