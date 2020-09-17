let book = require("../models/book");

exports.index = (req, res) => {
  res.send("Not implemented: home page");
};

//display list of all books
exports.bookList = (req, res) => {
  res.send("Not implemented: book List");
};

//display details about specific book
exports.bookDetails = (req, res) => {
  res.send(`Not implemented: book Details: ${req.params.id}`);
};

exports.createBookOnGet = (req, res) => {
  res.send("Not implemented: book Create On GET");
};

exports.createBookOnPost = (req, res) => {
  res.send("Not implemented: book Create On POST");
};

exports.bookDeleteOnGet = (req, res) => {
  res.send("Not implemented: book Delete On GET");
};

exports.bookDeleteOnPost = (req, res) => {
  res.send("Not implemented: book Delete On POST");
};

exports.bookUpdateOnGet = (req, res) => {
  res.send("Not implemented: book Update On GET");
};

exports.bookUpdateOnPost = (req, res) => {
  res.send("Not implemented: book Update On POST");
};
