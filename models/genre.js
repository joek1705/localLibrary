const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  name: { type: String, minlength: 3, maxlength: 100, required: true },
});

genreSchema.virtual("url").get(() => {
  return "/catalog/genre/" + this._id;
});

module.exports = mongoose.model("genre", genreSchema);
