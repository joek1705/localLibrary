let bookInstance = require("../models/bookinstance");
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
