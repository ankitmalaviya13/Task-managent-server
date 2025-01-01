const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const rateSchema = new mongoose.Schema(
  {
    rate:{type:Number,required: false,},
    rateText: { type: String, required: false }, 
    rateBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rate", rateSchema);


