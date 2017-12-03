var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.ObjectId;

var schema = new mongoose.Schema({
  bucket: { type: String, required: true },
  key: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  location: String,
  fieldname: String,
  encoding: String,
  etag: String
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
