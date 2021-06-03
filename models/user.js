const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "Subscriber",
    },
    cart: {
      type: Array,
      default: [],
    },
    gender: {
      type: String,
      enum: ["Masculin", "Feminin"],
    },
    nickname: String,
    phone: String,
    fix: String,
    profileImage: Object,
    // whishlist: [{type: ObjectId, ref: "Product"}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
