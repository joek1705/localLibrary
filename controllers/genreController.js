let genre = require("../models/genre");
let async = require("async");
let book = require("../models/book");
const validator = require("express-validator");

//display list of all genres
exports.genreList = (req, res, next) => {
  genre
    .find()
    .populate("genre")
    .sort([["name", "ascending"]])
    .exec((err, genreList) => {
      if (err) {
        return next(err);
      }
      res.render("genre_list", {
        title: "Genre List",
        genre_list: genreList,
      });
    });
};

//display details about specific genre
exports.genreDetails = (req, res, next) => {
  async.parallel(
    {
      genre: (callback) => {
        genre.findById(req.params.id).exec(callback);
      },
      genre_books: (callback) => {
        book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        let err = new Error("Couldn't find genre");
        err.status = 404;
        return next(err);
      }
      res.render("genre_detail", {
        title: "Genre Details",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

exports.createGenreOnGet = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

exports.createGenreOnPost = [
  validator.body("name", "Genre name required").trim().isLength({ min: 1 }),
  validator.sanitize("name").escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    let newGenre = new genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: newGenre,
        errors: errors.array(),
      });
      return;
    } else {
      genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          newGenre.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(newGenre.url);
          });
        }
      });
    }
  },
];

exports.genreDeleteOnGet = (req, res, next) => {
  async.parallel(
    {
      currGenre: (callback) => {
        genre.findById(req.params.id).exec(callback);
      },
      books: (callback) => {
        book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre === null) {
        res.redirect("/catalog/genres");
      }
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.currGenre,
        books: results.books,
      });
    }
  );
};

exports.genreDeleteOnPost = (req, res) => {
  async.parallel(
    {
      currGenre: (callback) => {
        genre.findById(req.params.id).exec(callback);
      },
      books: (callback) => {
        book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.books.length > 0) {
        res.render("genre_delete", {
          title: "Delete Genre",
          genre: results.currGenre,
          books: results.books,
        });
        return;
      } else {
        genre.findByIdAndRemove(req.body.genreid, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/genres");
        });
      }
    }
  );
};

exports.genreUpdateOnGet = (req, res, next) => {
  genre.findById(req.params.id).exec((err, genre) => {
    if (err) {
      return next(err);
    }
    if (genre == null) {
      let err = new Error("Couldn't find genre");
      err.status = 404;
      return next(err);
    }
    res.render("genre_form", { title: "Update Genre", genre: genre });
  });
};

exports.genreUpdateOnPost = [
  validator.body("name", "Genre name required").trim().isLength({ min: 1 }),
  validator.sanitize("name").escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    let newGenre = new genre({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update Genre",
        genre: newGenre,
        errors: errors.array(),
      });
      return;
    } else {
      genre.findByIdAndUpdate(req.params.id, newGenre, {}, (err, new_genre) => {
        if (err) {
          return next(err);
        }
        res.redirect(new_genre.url);
      });
    }
  },
];
