const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const expertiseSchema = new mongoose.Schema({ 
    name: { type: String, required: true },                   
}, { timestamps: true});

module.exports = mongoose.model("expertises", expertiseSchema);