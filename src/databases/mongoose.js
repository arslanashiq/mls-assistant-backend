const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("successfully connected to the database");
  })
  .catch((err) => {
    console.log(process.env.MONGODB_URI);
    console.log("error connecting to the database", err);
    process.exit();
  });
module.exports = {mongoose};
