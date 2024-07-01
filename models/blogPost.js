const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, required: true },
  isPublished: { type: Boolean, default: false },
});

BlogPostSchema.virtual('timestamp_formatted').get(function() {
  return this.timestamp
    ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
    : '';
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
