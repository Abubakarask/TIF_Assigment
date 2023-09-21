import Database from "../../loaders/v1/database";
import { collections } from "../../schema/v1/meta";

const data = [
  { id: 1, book: "Rich Dad Poor Dad", author: "ABC" },
  { id: 2, book: "Atomic Habits", author: "DEF" },
];

class BookService {
  static async getAll() {
    return Database.instance.collection(collections.roles).find().toArray();
  }

  static async getSingle(id: number) {
    return data.find((item) => item.id === id) ?? null;
  }
}

export default BookService;
