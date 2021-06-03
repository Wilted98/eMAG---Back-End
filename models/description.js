const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const descriptionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    product: {
      type: ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductDescription", descriptionSchema);
