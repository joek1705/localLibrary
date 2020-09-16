const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

authorSchema.virtual("name").get(() => {
  let fullName = "";
  if (this.firstName && this.familyName) {
    fullName = this.first_ame + this.family_ame;
  }
  return fullName;
});

authorSchema.virtual("lifespan").get(() => {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

authorSchema.virtual("url").get(() => {
  return "/catalog/author/" + this._id;
});

module.exports = mongoose.model("author", authorSchema);
