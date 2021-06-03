const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const specsSchema = new mongoose.Schema(
  {
    specs: {
      type: Array,
    },
    product: {
      type: ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Specs", specsSchema);
