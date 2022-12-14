import {BookDTO} from "../dto/bookDTO";

import BookEntity from "../entities/bookEntity";
import {IBook, IQuery} from "../interfaces/IBook";
import {BaseService} from "../../config/base.service";
import {IPagination} from "../../shared/interfaces/pagination.interfaces";


export class BookService extends BaseService<BookDTO> {
  constructor() {
    super(BookEntity);
  }

  async findAllBooks({page, limit}: IPagination) {
    const [records, total] = await Promise.all([
      BookEntity.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .select(["-__v",]),
      BookEntity.find().count()
    ])
    const pages = Math.ceil(total / limit)
    return {records, total, pages}
  }

  async findBookById(id: string) {
    return {records: await BookEntity.findOne({_id: id}).select(["-__v",]), total: 1};
  }

  async findBookByQuery(book: IBook) {
    const query = this.buildQuery(book)
    const [records, total] = await Promise.all([
      BookEntity.find(query)
        .skip((book.page - 1) * book.limit)
        .limit(book.limit)
        .select(["-__v",]),
      BookEntity.find(query).count()
    ])
    const pages = Math.ceil(total / book.limit)
    return {records, total, pages}
  }

  async createBook(body: BookDTO): Promise<IBook | null> {
    const testBook = <IBook>{
      page: 1,
      limit: 2,
      author: body["Book-Author"],
      isbn: body["ISBN"],
      publisher: body["Publisher"],
      title: body["Book-Title"],
      year: body["Year-Of-Publication"],
    }
    const bookExist = await this.findBookByQuery(testBook)
    if (bookExist.total > 0) return null
    return await BookEntity.create(body)
  }

  async deleteBook(id: string): Promise<any> {
    console.log(id)
    return BookEntity.deleteOne({_id: id});
  }

  async updateBook(id: string, infoUpdate: BookDTO): Promise<any> {
    return BookEntity.updateOne({_id: id}, infoUpdate);
  }


  private buildQuery(book: IBook): object {
    const query = <IQuery>{}
    book.author ? query["Book-Author"] = {$regex: `.*${book.author}.*`} : undefined
    book.isbn ? query["ISBN"] = {$regex: `.*${book.isbn}.*`} : undefined
    book.publisher ? query["Publisher"] = {$regex: `.*${book.publisher}.*`} : undefined
    book.title ? query["Book-Title"] = {$regex: `.*${book.title}.*`} : undefined
    book.year ? query["Year-Of-Publication"] = {$regex: `.*${book.year}.*`} : undefined

    // const returnedTarget = Object.assign([], query);
    // const otherQuery = {
    //   $or: [
    //     {"ISBN": {$regex: `.*${book.bookQuery}.*`}},
    //     {"Book-Title": {$regex: `.*${book.bookQuery}.*`}},
    //     {"Book-Author": {$regex: `.*${book.bookQuery}.*`}},
    //     {"Year-Of-Publication": {$regex: `.*${book.bookQuery}.*`}},
    //     {"Publisher": {$regex: `.*${book.bookQuery}.*`}},
    //   ]
    // }
    //
    // returnedTarget.push(otherQuery)
    return query
  }
}
