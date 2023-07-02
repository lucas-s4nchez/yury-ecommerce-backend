import { BaseRouter } from "../shared/router/router";
import { SizeController } from "./controllers/size.controller";
import { SizeMiddleware } from "./middlewares/size.middleware";

export class SizeRoute extends BaseRouter<SizeController, SizeMiddleware> {
  constructor() {
    super(SizeController, SizeMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  routes(): void {
    this.router.get("/sizeList", (req, res) =>
      this.controller.sizeList(req, res)
    );
    this.router.get("/sizes", (req, res) => this.controller.getSizes(req, res));
    this.router.get("/sizes/:id", (req, res) =>
      this.controller.getSizeById(req, res)
    );
    this.router.post(
      "/sizes",
      this.middleware.sizeValidator.bind(this.middleware),
      (req, res) => this.controller.createSize(req, res)
    );
    this.router.put(
      "/sizes/:id",
      this.middleware.updateSizeValidator.bind(this.middleware),
      (req, res) => this.controller.updateSize(req, res)
    );
    this.router.delete("/sizes/:id", (req, res) =>
      this.controller.deleteSize(req, res)
    );
  }
}
