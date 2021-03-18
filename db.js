const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(`Error while connecting to MongoDB: `, error.message);
  }
};

module.exports = connectToDB;
