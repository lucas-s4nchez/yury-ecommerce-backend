import { BaseRouter } from "../shared/router/router";
import { ColorController } from "./controllers/color.controller";
import { ColorMiddleware } from "./middlewares/color.middleware";

export class ColorRoute extends BaseRouter<ColorController, ColorMiddleware> {
  constructor() {
    super(ColorController, ColorMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  routes(): void {
    this.router.get("/colorList", (req, res) =>
      this.controller.colorList(req, res)
    );
    this.router.get(
      "/colors",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getColors(req, res)
    );
    this.router.get(
      "/colors/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getColorById(req, res)
    );
    this.router.post(
      "/colors",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.colorValidator.bind(this.middleware),
      (req, res) => this.controller.createColor(req, res)
    );
    this.router.put(
      "/colors/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.updateColorValidator.bind(this.middleware),
      (req, res) => this.controller.updateColor(req, res)
    );
    this.router.delete(
      "/colors/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.deleteColor(req, res)
    );
  }
}
