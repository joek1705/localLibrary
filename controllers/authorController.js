let author = require("../models/author");

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
exports.authorDetails = (req, res) => {
  res.send(`Not implemented: Author Details: ${req.params.id}`);
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
