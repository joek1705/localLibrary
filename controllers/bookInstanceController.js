let bookInstance = require("../models/bookinstance");

//display list of all book instances
exports.bookInstanceList = (req, res) => {
  res.send("Not implemented: bookinstance List");
};

//display details about specific book instance
exports.bookInstanceDetails = (req, res) => {
  res.send(`Not implemented: bookinstance Details: ${req.params.id}`);
};

exports.createBookInstanceOnGet = (req, res) => {
  res.send("Not implemented: bookinstance Create On GET");
};

exports.createbookInstanceOnPost = (req, res) => {
  res.send("Not implemented: bookinstance Create On POST");
};

exports.bookInstanceDeleteOnGet = (req, res) => {
  res.send("Not implemented: bookinstance Delete On GET");
};

exports.bookInstanceDeleteOnPost = (req, res) => {
  res.send("Not implemented: bookinstance Delete On POST");
};

exports.bookInstanceUpdateOnGet = (req, res) => {
  res.send("Not implemented: bookinstance Update On GET");
};

exports.bookInstanceUpdateOnPost = (req, res) => {
  res.send("Not implemented: bookinstance Update On POST");
};
