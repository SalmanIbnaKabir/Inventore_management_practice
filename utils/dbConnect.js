const mongoose = require("mongoose");
// database connection
module.exports = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Database connection established`.red.bold);
    });
};
