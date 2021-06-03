const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const amount = req.headers.amount;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "RON",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
