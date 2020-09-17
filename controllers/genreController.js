let genre = require("../models/genre");

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
exports.genreDetails = (req, res) => {
  res.send(`Not implemented: genre Details: ${req.params.id}`);
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
