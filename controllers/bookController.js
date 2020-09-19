let book = require("../models/book");
let author = require("../models/author");
let bookInstance = require("../models/bookinstance");
let genre = require("../models/genre");
let async = require("async");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

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
exports.bookDetails = (req, res, next) => {
  async.parallel(
    {
      book: (callback) => {
        book
          .findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      book_instance: (callback) => {
        bookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

exports.createBookOnGet = (req, res, next) => {
  async.parallel(
    {
      authors: (callback) => {
        author.find(callback);
      },
      genres: (callback) => {
        genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

exports.createBookOnPost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }),
  body("author", "Author must not be empty.").trim().isLength({ min: 1 }),
  body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }),
  sanitizeBody("author").escape(),
  sanitizeBody("title").escape(),
  sanitizeBody("isbn").escape(),
  sanitizeBody("summary").escape(),
  sanitizeBody("genre.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    let newBook = new book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: (callback) => {
            author.find(callback);
          },
          genres: (callback) => {
            genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.genres.length; i++) {
            if (newBook.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: newBook,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      newBook.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(newBook.url);
      });
    }
  },
];

exports.bookDeleteOnGet = (req, res, next) => {
  async.parallel(
    {
      currentBook: (callback) => {
        book.findById(req.params.id).exec(callback);
      },
      bookinstances: (callback) => {
        bookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book === null) {
        res.redirect("/catalog/book");
      }
      res.render("book_delete", {
        title: "Delete Book",
        book: results.currentBook,
        instances: results.bookinstances,
      });
    }
  );
};

exports.bookDeleteOnPost = (req, res, next) => {
  async.parallel(
    {
      currentBook: (callback) => {
        book.findById(req.params.id).exec(callback);
      },
      bookinstances: (callback) => {
        bookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.bookinstances.length > 0) {
        res.render("book_delete", {
          title: "Delete Book",
          book: results.currentBook,
          instances: results.bookinstances,
        });
        return;
      } else {
        book.findByIdAndRemove(req.body.bookid, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/books");
        });
      }
    }
  );
};

exports.bookUpdateOnGet = (req, res, next) => {
  async.parallel(
    {
      book: (callback) => {
        book
          .findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      authors: (callback) => {
        author.find(callback);
      },
      genres: (callback) => {
        genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // Mark the selected genres as checked.
      for (
        let all_g_iter = 0;
        all_g_iter < results.genres.length;
        all_g_iter++
      ) {
        for (
          let book_g_iter = 0;
          book_g_iter < results.book.genre.length;
          book_g_iter++
        ) {
          if (
            results.genres[all_g_iter]._id.toString() ==
            results.book.genre[book_g_iter]._id.toString()
          ) {
            results.genres[all_g_iter].checked = "true";
          }
        }
      }
      res.render("book_form", {
        title: "Update Book",
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
};

exports.bookUpdateOnPost = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }),
  body("author", "Author must not be empty.").trim().isLength({ min: 1 }),
  body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }),

  // Sanitize fields.
  sanitizeBody("title").escape(),
  sanitizeBody("author").escape(),
  sanitizeBody("summary").escape(),
  sanitizeBody("isbn").escape(),
  sanitizeBody("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);

    var newBook = new book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: (callback) => {
            author.find(callback);
          },
          genres: (callback) => {
            genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark the selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (newBook.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book: newBook,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      book.findByIdAndUpdate(req.params.id, newBook, {}, (err, thebook) => {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  },
];
