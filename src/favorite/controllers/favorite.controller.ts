import { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/http.response";
import { OrderType } from "../../shared/types/shared.types";
import { FavoriteService } from "../services/favorite.service";

export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService = new FavoriteService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getFavorites(req: Request, res: Response) {
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

      const data = await this.favoriteService.findAllFavoritesAndPaginate(
        pageNumber,
        limitNumber,
        order,
        req.user.id
      );

      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No hay favoritos");
      }
      const [favorites, count, totalPages] = data;
      return this.httpResponse.Ok(res, { favorites, count, totalPages });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async createFavorite(req: Request, res: Response) {
    const favoriteData = req.body;
    favoriteData.user = req.user;

    try {
      const existingFavorite = await this.favoriteService.findFavoriteByUserId(
        favoriteData.user.id
      );
      if (existingFavorite) {
        return this.httpResponse.BadRequest(
          res,
          "Este producto ya se encuentra en tu lista de favoritos"
        );
      }
      const data = await this.favoriteService.createFavorite(favoriteData);
      if (!data) {
        return this.httpResponse.BadRequest(
          res,
          "Error al agregar el producto a favoritos"
        );
      }
      return this.httpResponse.Ok(res, "Producto agregado a favoritos");
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async deleteFavorite(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingFavorite = await this.favoriteService.findFavoriteById(id);
      if (!existingFavorite) {
        return this.httpResponse.NotFound(
          res,
          "No existe este producto en favoritos"
        );
      }
      const deletedFavorite = await this.favoriteService.deleteFavorite(id);
      if (!deletedFavorite) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(
        res,
        "Producto eliminado correctamente de tus favoritos"
      );
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
}
