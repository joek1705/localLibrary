const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "genre" }],
});

bookSchema.virtual("url").get(function () {
  return "/catalog/book/" + this._id;
});

module.exports = mongoose.model("book", bookSchema);
