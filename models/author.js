const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

authorSchema.virtual("name").get(function () {
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = this.first_name + ", " + this.family_name;
  }
  return fullName;
});

authorSchema.virtual("lifespan").get(function () {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

authorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

module.exports = mongoose.model("author", authorSchema);
