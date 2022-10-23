import {Request, Response} from "express";
import {HttpResponse,} from "../../shared/response/http.response";
import {BookService} from "../services/bookService";
import {IPagination} from "../../shared/interfaces/pagination.interfaces";

export class BookController {
  constructor(
    private readonly bookService: BookService = new BookService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {
  }

  async getBook(req: Request, res: Response) {
    const {offset, limit} = req.query
    const queryData = <IPagination>{
      limit: Number(limit),
      offset: Number(offset),
    }
    try {
      const data = await this.bookService.findAllBooks(queryData);
      if (data.length === 0) {
        return this.httpResponse.NotFound(res, "No hay libros. Ejecute '/api/seed'");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async getBookById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const data = await this.bookService.findBookById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async findBookByName(req: Request, res: Response) {
    const {search} = req.query;
    try {
      if (search !== undefined) {
        const data = await this.bookService.findBookByName(search);
        if (!data) {
          return this.httpResponse.NotFound(res, "No existe dato");
        }
        return this.httpResponse.Ok(res, data);
      }
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async createBook(req: Request, res: Response) {
    try {
      const data = await this.bookService.createBook(req.body);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe dato");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async updateBook(req: Request, res: Response) {
    const {id} = req.params;
    try {
      // const data: UpdateResult = await this.bookService.updateBook(
      //   id,
      //   req.body
      // );
      const data = {
        affected: false
      }
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Hay un error en actualizar");
      }

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteBook(req: Request, res: Response) {
    const {id} = req.params;
    try {
      // const data: DeleteResult = await this.bookService.deleteBook(id);
      const data = {}
      res.status(200).json(data);
      // if (!data.affected) {
      //   return this.httpResponse.NotFound(res, "Hay un error en borrar");
      // }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.error(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
