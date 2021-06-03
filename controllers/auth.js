const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, email, picture } = req.user;
  const user = await User.findOneAndUpdate(
    { email },
    { name, picture },
    { new: true }
  );
  if (user) {
    console.log("User updated", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name,
      picture,
    }).save();
    console.log("User created", newUser);
    res.json(newUser);
  }
};
exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    if (user.role === "admin") {
      res.json({ res: "OK" });
    } else if (user.role === "Subscriber") {
      res.json({ res: "Fail!" });
    }
  });
};
