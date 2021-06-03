const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      text: true,
      trim: true,
      required: true,
      maxlength: 256,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 2000,
      required: true,
      text: true,
    },
    oldPrice: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Da", "Nu"],
    },
    color: {
      type: String,
      enum: ["Alb", "Negru", "Argintiu", "Albastru", "Rosu", "Verde", "Gri"],
    },
    brand: {
      type: String,
      enum: [
        "Lenovo",
        "Apple",
        "Huawei",
        "Samsung",
        "LG",
        "HP",
        "Dell",
        "ASUS",
        "Acer",
        "Razer",
      ],
    },
    ratingsandcomments: [
      {
        postedBy: { type: ObjectId, ref: "User" },
        star: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          maxlength: 5000,
          minlength: 10,
          required: true,
          text: true,
        },
        commenttitle: {
          type: String,
          maxlength: 50,
          minlength: 2,
          required: true,
          text: true,
        },
        img: {
          type: Array,
        },
        postedAt: {
          type: Date,
          default: new Date(),
        },
        numberOfLikes: Array,
      },
    ],
  },
  { timestamps: true }
);

// ratings: [
//     {
//       star: Number,
//       postedBy: { type: ObjectId, ref: "User" },
//     },
//   ],

module.exports = mongoose.model("Product", productSchema);
