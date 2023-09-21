import express from "express";
import BookController from "../../controllers/v1/books";

const BookRouter = express.Router();

BookRouter.get("/", BookController.getAll);
BookRouter.get("/:id", BookController.getSingle);

export default BookRouter;
