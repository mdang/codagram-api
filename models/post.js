const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema({
  bucket: { type: String, required: true },
  key: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  location: String,
  fieldname: String,
  encoding: String,
  etag: String
});

const Post = mongoose.model('Post', schema);

module.exports = Post;
