let genre = require("../models/genre");
let async = require("async");
let book = require("../models/book");

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

exports.createGenreOnGet = (req, res) => {
  res.send("Not implemented: genre Create On GET");
};

exports.createGenreOnPost = (req, res) => {
  res.send("Not implemented: genre Create On POST");
};

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
