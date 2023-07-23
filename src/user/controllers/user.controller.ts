import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HttpResponse } from "../../shared/response/http.response";
import { UpdateResult } from "typeorm";
import { OrderType } from "../../shared/types/shared.types";

export class UserController {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getUser(req: Request, res: Response) {
    try {
      let { page = 1, limit = 5, order = OrderType.ASC as any } = req.query;
      let pageNumber = parseInt(page as string, 10);
      let limitNumber = parseInt(limit as string, 10);

      // Validar si los valores son numéricos y mayores a 0
      if (isNaN(pageNumber) || pageNumber <= 0) {
        pageNumber = 1; // Valor predeterminado si no es un número válido
      }
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 5; // Valor predeterminado si no es un número válido
      }

      // Validar el valor de order
      if (!(order in OrderType)) {
        order = OrderType.ASC; // Valor predeterminado si no es válido
      }

      const data = await this.userService.findAllUsers(
        pageNumber,
        limitNumber,
        order
      );
      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay usuarios");
      }
      const [users, count, totalPages] = data;
      return this.httpResponse.Ok(res, { users, count, totalPages });
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.userService.findUserById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este usuario");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingUser = await this.userService.findUserById(id);
      if (!existingUser) {
        return this.httpResponse.NotFound(res, "Usuario no encontrado");
      }
      const data = await this.userService.deleteUser(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, "Usuario eliminado");
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
