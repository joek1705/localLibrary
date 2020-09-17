let book = require("../models/book");
let author = require("../models/author");
let bookInstance = require("../models/bookinstance");
let genre = require("../models/genre");
let async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      book_count: (callback) => {
        book.countDocuments({}, callback);
      },
      book_instance_count: (callback) => {
        bookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: (callback) => {
        bookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: (callback) => {
        author.countDocuments({}, callback);
      },
      genre_count: (callback) => {
        genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

//display list of all books
exports.bookList = (req, res, next) => {
  book
    .find({}, "title author")
    .populate("author")
    .exec((err, books) => {
      if (err) {
        return next(err);
      }
      res.render("book_list", { title: "Book List", book_list: books });
    });
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
