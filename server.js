const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
dotenv.config({ path: ".env" });
const routes = require("./routes/auth");

const app = express();
app.use(cors());
mongoose.set("useCreateIndex", true);

mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED SUCCESFULLY!");
  })
  .catch((err) => console.log(err));

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

//This will import automatic all routes from routes folder.
readdirSync("./routes").map((arg) =>
  app.use("/api", require(`./routes/${arg}`))
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
