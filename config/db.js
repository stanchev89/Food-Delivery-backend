const config = require('./config');
const mongoose = require('mongoose');

module.exports = () => {
  return mongoose.connect(config.DB_URL_CREDENTIALS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
};