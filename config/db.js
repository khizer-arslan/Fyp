const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
     await mongoose.connect(db, {
      useNewUrlParser: true,
      // useCreateIndex:true
    });
    console.log('Mongo DB Connected');
  } catch (err) {
    console.log(err.message);
    // eXIT PROCESS WITH FAILURE
    process.exit(1);
  }
};
module.exports = connectDB;
