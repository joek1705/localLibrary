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

exports.genreDeleteOnGet = (req, res) => {
  res.send("Not implemented: genre Delete On GET");
};

exports.genreDeleteOnPost = (req, res) => {
  res.send("Not implemented: genre Delete On POST");
};

exports.genreUpdateOnGet = (req, res) => {
  res.send("Not implemented: genre Update On GET");
};

exports.genreUpdateOnPost = (req, res) => {
  res.send("Not implemented: genre Update On POST");
};
