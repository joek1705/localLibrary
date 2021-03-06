const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

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
  return `${this.date_of_birth_formatted} - ${this.date_of_death_formatted}`;
});

authorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? moment(this.date_of_birth).format("YYYY-MM-DD")
    : "";
});

authorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? moment(this.date_of_death).format("YYYY-MM-DD")
    : "";
});

authorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

module.exports = mongoose.model("author", authorSchema);
