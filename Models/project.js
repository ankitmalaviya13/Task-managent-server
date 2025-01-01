const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    visibility: { type: String, required: true }, 
    AddedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },      
    members: [{ type: Schema.Types.ObjectId, ref: "users" }],          
}, { timestamps: true});

module.exports = mongoose.model("projects", projectSchema);