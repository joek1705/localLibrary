let bookInstance = require("../models/bookinstance");
let book = require("../models/book");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const bookinstance = require("../models/bookinstance");

//display list of all book instances
exports.bookInstanceList = (req, res, next) => {
  bookInstance
    .find()
    .populate("book")
    .exec((err, instances) => {
      if (err) {
        return next(err);
      }
      res.render("book_instance_list", {
        title: "Book Instance List",
        bookInstances: instances,
      });
    });
};

//display details about specific book instance
exports.bookInstanceDetails = (req, res, next) => {
  bookInstance
    .findById(req.params.id)
    .populate("book")
    .exec((err, instance) => {
      if (err) {
        return next(err);
      }
      if (instance == null) {
        // No results.
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_detail", {
        title: "Copy: " + instance.book.title,
        bookinstance: instance,
      });
    });
};

exports.createBookInstanceOnGet = (req, res, next) => {
  book.find({}, "title").exec((err, books) => {
    if (err) {
      return next(err);
    }
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books,
    });
  });
};

exports.createbookInstanceOnPost = [
  // Validate fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }),
  body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }),
  body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody("book").escape(),
  sanitizeBody("imprint").escape(),
  sanitizeBody("status").trim().escape(),
  sanitizeBody("due_back").toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);

    let bookinstance = new bookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec((err, books) => {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance,
        });
      });
      return;
    } else {
      bookinstance.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new record.
        res.redirect(bookinstance.url);
      });
    }
  },
];

exports.bookInstanceDeleteOnGet = (req, res, next) => {
  bookInstance.findById(req.params.id).exec((err, result) => {
    if (err) {
      return next(err);
    }
    res.render("book_instance_delete", {
      title: "Delete Bookinstance",
      instance: result,
    });
  });
};

exports.bookInstanceDeleteOnPost = (req, res, next) => {
  bookInstance.findByIdAndRemove(req.body.bookinstanceID, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/bookinstances");
  });
};

exports.bookInstanceUpdateOnGet = (req, res) => {
  res.send("Not implemented: bookinstance Update On GET");
};

exports.bookInstanceUpdateOnPost = (req, res) => {
  res.send("Not implemented: bookinstance Update On POST");
};
