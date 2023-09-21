import express, { Request, Response } from "express";
import BookService from "../../services/v1/books";

class BookController {
  static async getAll(request: Request, response: Response) {
    const data = await BookService.getAll();
    return response.json({ success: true, content: { data } });
  }

  static async getSingle(request: Request, response: Response) {
    const data = await BookService.getSingle(Number(request.params.id));
    return response.json({ success: true, content: { data } });
  }
}

export default BookController;
