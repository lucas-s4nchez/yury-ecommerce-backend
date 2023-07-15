import { BaseRouter } from "../shared/router/router";
import { ImageController } from "./controllers/image.controller";
import { ImageMiddleware } from "./middlewares/image.middleware";

export class ImageRoute extends BaseRouter<ImageController, ImageMiddleware> {
  constructor() {
    super(ImageController, ImageMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de categoria
  routes(): void {
    this.router.post(
      "/images/:productId",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.fileValidator.bind(this.middleware),
      (req, res) => this.controller.createImage(req, res)
    );
    this.router.get(
      "/images/:productId",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getImages(req, res)
    );
    this.router.delete(
      "/images/:productId/delete/:imageId",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.deleteImage(req, res)
    );
  }
}
