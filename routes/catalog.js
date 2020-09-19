let express = require("express");
let router = express.Router();

let bookController = require("../controllers/bookController");
let authorController = require("../controllers/authorController");
let bookInstanceController = require("../controllers/bookInstanceController");
let genreController = require("../controllers/genreController");
let genre = require("../models/genre");

/*** BOOK ROUTES ***/

//for getting catalog home page
router.get("/", bookController.index);

//Get request for creating book
router.get("/book/create", bookController.createBookOnGet);

//post request for creating book
router.post("/book/create", bookController.createBookOnPost);

//Get request for deleting book
router.get("/book/:id/delete", bookController.bookDeleteOnGet);

//post request for deleting book
router.post("/book/:id/delete", bookController.bookDeleteOnPost);

//Get request for updating book
router.get("/book/:id/update", bookController.bookUpdateOnGet);

//post request for updating book
router.post("/book/:id/update", bookController.bookUpdateOnPost);

//Get request for one book
router.get("/book/:id", bookController.bookDetails);

//Get request for all book items
router.get("/books", bookController.bookList);

/*** AUTHOR ROUTES ***/

// get request for creating author
router.get("/author/create", authorController.createAuthorOnGet);

// post request for creating author
router.post("/author/create", authorController.createAuthorOnPost);

// get request for deleting author
router.get("/author/:id/delete", authorController.authorDeleteOnGet);

// post request for deleting author
router.post("/author/:id/delete", authorController.authorDeleteOnPost);

// get request for updating author
router.get("/author/:id/update", authorController.authorUpdateOnGet);

// post request for updating author
router.post("/author/:id/update", authorController.authorUpdateOnPost);

//get request for one author
router.get("/author/:id", authorController.authorDetails);

//get request for list of authors
router.get("/authors", authorController.authorList);

/*** GENRE ROUTES ***/

//get request for genre creation
router.get("/genre/create", genreController.createGenreOnGet);

//post request for genre creation
router.post("/genre/create", genreController.createGenreOnPost);

//get request for deleting genre
router.get("/genre/:id/delete", genreController.genreDeleteOnGet);

//post request for deleting genre
router.post("/genre/:id/delete", genreController.genreDeleteOnPost);

//get request for updating genre
router.get("/genre/:id/update", genreController.genreUpdateOnGet);

//post request for updating genre
router.post("/genre/:id/update", genreController.genreUpdateOnPost);

//get request for one genre
router.get("/genre/:id", genreController.genreDetails);

//get request for list of all genres
router.get("/genres", genreController.genreList);

/*** BOOKINSTANCE ROUTES ***/

//get request for bookinstance creation
router.get(
  "/bookinstance/create",
  bookInstanceController.createBookInstanceOnGet
);

//post request for bookinstance creation
router.post(
  "/bookinstance/create",
  bookInstanceController.createbookInstanceOnPost
);

//get request for bookinstance deletion
router.get(
  "/bookinstance/:id/delete",
  bookInstanceController.bookInstanceDeleteOnGet
);

//post request for bookinstance deletion
router.post(
  "/bookinstance/:id/delete",
  bookInstanceController.bookInstanceDeleteOnPost
);

//get request to update bookinstance
router.get(
  "/bookinstance/:id/update",
  bookInstanceController.bookInstanceUpdateOnGet
);

//post request to update bookinstance
router.post(
  "/bookinstance/:id/update",
  bookInstanceController.bookInstanceUpdateOnPost
);

//get one bookinstance
router.get("/bookinstance/:id", bookInstanceController.bookInstanceDetails);

//get list of all bookinstances
router.get("/bookinstances", bookInstanceController.bookInstanceList);

module.exports = router;
