const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");
const User = require("../models/user");
const ProductDescription = require("../models/description");
const Specs = require("../models/specs");

exports.leavemaindescription = async (req, res) => {
  const { mainDescription } = req.body;
  const { productId } = req.body;
  const finddescription = await ProductDescription.exists({
    product: productId,
  });
  if (!finddescription) {
    await new ProductDescription({
      description: mainDescription,
      product: productId,
    }).save();
  }
  res.json(200);
};

exports.getspecs = async (req, res) => {
  //
  const { productId } = req.body;
  const specs = await Specs.findOne({
    product: productId,
  }).exec();
  res.json(specs);
};

exports.getDescription = async (req, res) => {
  const { productId } = req.body;
  const description = await ProductDescription.findOne({
    product: productId,
  }).exec();
  res.json(description);
};

exports.addspecs = async (req, res) => {
  const { productId } = req.body; //product
  const { specs } = req.body; // specs
  const find = await Specs.exists({ product: productId });
  if (!find) {
    await new Specs({ product: productId, specs: specs }).save();
  }
  res.json(200);
};

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to create product!");
  }
};

exports.read = async (req, res) => {
  let products = await Product.find({});
  res.json(products);
};

exports.getPrductsByCat = async (req, res) => {
  const { slug } = req.body;
  let category = await Category.findOne({ slug }).exec();
  const products = await Product.find({ category }).populate("category").exec();
  res.json({ category, products });
};
exports.getProductsByCat = async (req, res) => {
  const { slug } = req.body;
  let category = await Category.findOne({ slug }).exec();
  const products = await Product.find({ category }).populate("category").exec();
  res.json({ category, products });
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.body;
    let product = await Product.findOne({ slug })
      .populate("category", "slug")
      .populate("ratingsandcomments.postedBy", "name profileImage")
      .exec();
    res.json(product);
  } catch (err) {
    res.status(400).send("Failed!");
  }
};

exports.getratingandcomment = async (req, res) => {
  const { id } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  const product = await Product.findById(id);

  let existingRatingObject = product.ratingsandcomments.find(
    (arg) => arg.postedBy.toString() === user._id.toString()
  );
  if (existingRatingObject !== undefined) {
    res.json(existingRatingObject);
  } else {
    res.json(null);
  }
};

exports.leaveratingandcomment = async (req, res) => {
  const { id } = req.body;
  const { arg } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  const product = await Product.findById(id);

  let existingRatingObject = product.ratingsandcomments.find(
    (arg) => arg.postedBy.toString() === user._id.toString()
  );

  if (existingRatingObject === undefined) {
    const ratingAndComment = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          ratingsandcomments: {
            postedBy: user._id,
            star: arg.star,
            comment: arg.comment,
            commenttitle: arg.commentTitle,
            img: req.body.images,
          },
        },
      },
      { new: true }
    ).exec();
    console.log("Rating added!", ratingAndComment);
    res.json(ratingAndComment);
  } else {
    const ratingAndCommentUpdated = await Product.updateOne(
      {
        ratingsandcomments: { $elemMatch: existingRatingObject },
      },
      {
        $set: {
          "ratingsandcomments.$.star": arg.star,
          "ratingsandcomments.$.comment": arg.comment,
          "ratingsandcomments.$.commenttitle": arg.commentTitle,
          "ratingsandcomments.$.img": req.body.images,
        },
      },
      { new: true }
    ).exec();
    console.log("Rating updated", ratingAndCommentUpdated);
    res.json(ratingAndCommentUpdated);
  }
};

exports.likeAndUnlike = async (req, res) => {
  const { prodId } = req.body;
  const { commentId } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  let userId = user._id;
  const product = await Product.findById(prodId);

  let existingRatingObject = await product.ratingsandcomments.find(
    (arg) => arg._id.toString() === commentId.toString()
  );
  let findUserLike = await existingRatingObject.numberOfLikes.find(
    (arg) => arg.toString() === userId.toString()
  );
  if (!findUserLike) {
    const likeorunlike = await Product.updateOne(
      {
        ratingsandcomments: { $elemMatch: existingRatingObject },
      },
      {
        $push: { "ratingsandcomments.$.numberOfLikes": userId },
      },
      { new: true }
    ).exec();
    res.json(existingRatingObject.numberOfLikes.length + 1);
  } else if (findUserLike) {
    const likeorunlike = await Product.updateOne(
      {
        ratingsandcomments: { $elemMatch: existingRatingObject },
      },
      {
        $pull: { "ratingsandcomments.$.numberOfLikes": userId },
      },
      { new: true }
    ).exec();
    res.json(existingRatingObject.numberOfLikes.length - 1);
  }
};

//Search / Filter
// { $text: { $search: query } }
//description: { $regex: query, $options: "im" },
const handleQuery = async (req, res, query) => {
  const products = await Product.find({
    description: { $regex: query, $options: "im" },
  })
    .populate("category", "slug title")
    .select("brand")
    .exec();
  res.json(products);
};

const handlePrice = async (req, res, price, category) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
      category,
    })
      .populate("category", "_id slug title")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStars = async (req, res, stars, category) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratingsandcomments.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ]).exec((err, aggretates) => {
    if (err) {
      console.log(err, "aggregate");
    }
    Product.find({ _id: aggretates, category })
      .populate("category", "_id slug title")
      .populate("postedBy", "_id name")
      .exec((err, products) => {
        if (err) console.log(err, "second agrr");
        res.json(products);
      });
  });
};

const handleBrand = async (req, res, brand, category) => {
  let product = await Product.find({ brand, category }).exec();
  res.json(product);
};

const handleQuantity = async (req, res, quantity, category) => {
  if (quantity === "greater") {
    let product = await Product.find({ quantity: { $gt: 4 }, category }).exec();
    res.json(product);
  } else if (quantity === "less") {
    let product = await Product.find({ quantity: { $lt: 5 }, category }).exec();
    res.json(product);
  }
};

const handleColor = async (req, res, color, category) => {
  let product = await Product.find({ color, category }).exec();
  res.json(product);
};

const handleFilter = async (req, res, cheapOrExp, category) => {
  if (cheapOrExp === "ascendent") {
    let product = await Product.find({ category }).sort({ price: 1 }).exec();
    res.json(product);
  } else if (cheapOrExp === "descendent") {
    let product = await Product.find({ category }).sort({ price: -1 }).exec();
    res.json(product);
  }
};

const handlePopAndNew = async (req, res, popularAndNew, category) => {
  if (popularAndNew === "new") {
    let product = await Product.find({ category })
      .sort({ createdAt: 1 })
      .exec();
    res.json(product);
  } else if (popularAndNew === "popular") {
    let product = await Product.find({ category })
      .sort({ createdAt: -1 })
      .exec();
    res.json(product);
  }
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    brand,
    quantity,
    color,
    cheapOrExp,
    popularAndNew,
  } = req.body;

  if (query) {
    console.log(query);
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    await handlePrice(req, res, price, category);
  }
  if (stars) {
    await handleStars(req, res, stars, category);
  }
  if (brand) {
    await handleBrand(req, res, brand, category);
  }
  if (quantity) {
    await handleQuantity(req, res, quantity, category);
  }
  if (color) {
    await handleColor(req, res, color, category);
  }
  if (cheapOrExp) {
    await handleFilter(req, res, cheapOrExp, category);
  }
  if (popularAndNew) {
    await handlePopAndNew(req, res, popularAndNew, category);
  }
};

exports.searchQuery = async (req, res) => {
  const { query } = req.body;
  if (query) {
    await handleQuery(req, res, query);
  }
};

exports.updateQuantity = async (req, res) => {
  const ids = req.body;
  console.log(ids);
  ids.map(async (item) => {
    await Product.findByIdAndUpdate(item.id, {
      $inc: { quantity: -item.qty, sold: +item.qty },
    });
  });
};
