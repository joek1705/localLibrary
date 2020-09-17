const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");
const book = require("./book");

const bookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "book", required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

bookInstanceSchema.virtual("url").get(function () {
  return "/catalog/bookinstance/" + this._id;
});

bookInstanceSchema.virtual("formattedDueBack").get(function () {
  return moment(this.due_back).format("MMMM Do, YYYY");
});

module.exports = mongoose.model("bookInstance", bookInstanceSchema);
