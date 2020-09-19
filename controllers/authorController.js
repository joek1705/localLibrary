let author = require("../models/author");
let async = require("async");
let book = require("../models/book");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

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
  res.render("author_form", { title: "Create Author" });
};

exports.createAuthorOnPost = [
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("You must specify the first name")
    .isAlphanumeric()
    .withMessage("First name contains characters that are not alpha-numeric"),
  body("family_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("You must specify the family name")
    .isAlphanumeric()
    .withMessage("Family name contains characters that are not alpha-numeric"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),
  body("date_of_death", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),

  //sanitize fields
  sanitizeBody("first_name").escape(),
  sanitizeBody("family_name").escape(),
  sanitizeBody("date_of_birth").toDate(),
  sanitizeBody("date_of_death").toDate(),

  //request processing after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        Author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      let newAuthor = new author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      newAuthor.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(newAuthor.url);
      });
    }
  },
];

exports.authorDeleteOnGet = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        author.findById(req.params.id).exec(callback);
      },
      author_books: (callback) => {
        book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author === null) {
        res.redirect("/catalog/authors");
      }
      res.render("author_delete", {
        title: "Delete Author",
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

exports.authorDeleteOnPost = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        author.findById(req.body.authorid).exec(callback);
      },
      author_books: (callback) => {
        book.find({ author: req.body.authorid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author_books.length > 0) {
        res.render("author_delete", {
          title: "Delete Author",
          author: results.author,
          author_books: results.author_books,
        });
        return;
      } else {
        author.findByIdAndRemove(req.body.authorid, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/authors");
        });
      }
    }
  );
};

exports.authorUpdateOnGet = (req, res) => {
  res.send("Not implemented: Author Update On GET");
};

exports.authorUpdateOnPost = (req, res) => {
  res.send("Not implemented: Author Update On POST");
};
