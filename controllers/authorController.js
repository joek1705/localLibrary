let author = require("../models/author");
let async = require("async");
let book = require("../models/book");

//display list of all authors
exports.authorList = (req, res, next) => {
  author
    .find()
    .populate("author")
    .sort([["family_name", "ascending"]])
    .exec((err, authorList) => {
      if (err) {
        return next(err);
      }
      res.render("author_list", {
        title: "Author List",
        author_list: authorList,
      });
    });
};

//display details about specific author
exports.authorDetails = (req, res, next) => {
  async.parallel(
    {
      Author: (callback) => {
        author.findById(req.params.id).exec(callback);
      },
      author_books: (callback) => {
        book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.Author == null) {
        let err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      res.render("author_detail", {
        title: "Author Detail",
        author: results.Author,
        author_books: results.author_books,
      });
    }
  );
};

exports.createAuthorOnGet = (req, res) => {
  res.send("Not implemented: Author Create On GET");
};

exports.createAuthorOnPost = (req, res) => {
  res.send("Not implemented: Author Create On POST");
};

exports.authorDeleteOnGet = (req, res) => {
  res.send("Not implemented: Author Delete On GET");
};

exports.authorDeleteOnPost = (req, res) => {
  res.send("Not implemented: Author Delete On POST");
};

exports.authorUpdateOnGet = (req, res) => {
  res.send("Not implemented: Author Update On GET");
};

exports.authorUpdateOnPost = (req, res) => {
  res.send("Not implemented: Author Update On POST");
};
