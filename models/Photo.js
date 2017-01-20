var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/photo_app2');

var schema = new mongoose.Schema({
  name: String,
  path: String
});

module.exports = mongoose.model('Photo', schema);

