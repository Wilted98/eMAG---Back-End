const User = require("../models/user");

exports.updateImgProfile = async (req, res) => {
  const { profileImage } = req.body;
  const update = await User.findOneAndUpdate(
    { email: req.user.email },
    { profileImage },
    { new: true }
  ).exec();
};

exports.getImageProfile = async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id).exec();
  res.json({ url: user?.profileImage.url });
};

exports.updateUserProfile = async (req, res) => {
  const { nickname, phone, fix, gender } = req.body;
  const update = await User.findOneAndUpdate(
    { email: req.user.email },
    { nickname, phone, fix, gender },
    { new: true }
  ).exec();
  res.json(update);
};
