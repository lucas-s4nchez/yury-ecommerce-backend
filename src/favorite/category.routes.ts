import { FavoriteController } from "./controllers/favorite.controller";
import { BaseRouter } from "../shared/router/router";
import { FavoriteMiddleware } from "./middlewares/favorite.midleware";

export class FavoriteRoute extends BaseRouter<
  FavoriteController,
  FavoriteMiddleware
> {
  constructor() {
    super(FavoriteController, FavoriteMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de favoritos
  routes(): void {
    this.router.get(
      "/favorites",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getFavorites(req, res)
    );
    this.router.get(
      "/favorites/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.getFavoriteById(req, res)
    );
    this.router.post(
      "/favorites",
      this.middleware.checkJsonWebToken,
      this.middleware.favoriteValidator.bind(this.middleware),
      (req, res) => this.controller.createFavorite(req, res)
    );
    this.router.delete(
      "/favorites/:id",
      this.middleware.checkJsonWebToken,
      (req, res) => this.controller.deleteFavorite(req, res)
    );
  }
}
