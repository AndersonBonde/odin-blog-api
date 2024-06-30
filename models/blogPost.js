const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, required: true },
  isPublished: { type: Boolean, default: false },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
