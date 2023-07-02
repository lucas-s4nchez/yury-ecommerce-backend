import { BaseRouter } from "../shared/router/router";
import { BrandController } from "./controllers/brand.controller";
import { BrandMiddleware } from "./middlewares/brand.middleware";

export class BrandRoute extends BaseRouter<BrandController, BrandMiddleware> {
  constructor() {
    super(BrandController, BrandMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  routes(): void {
    this.router.get("/brandList", (req, res) =>
      this.controller.brandList(req, res)
    );
    this.router.get("/brands", (req, res) =>
      this.controller.getBrands(req, res)
    );
    this.router.get("/brands/:id", (req, res) =>
      this.controller.getBrandById(req, res)
    );
    this.router.post(
      "/brands",
      this.middleware.brandValidator.bind(this.middleware),
      (req, res) => this.controller.createBrand(req, res)
    );
    this.router.put(
      "/brands/:id",
      this.middleware.brandValidator.bind(this.middleware),
      (req, res) => this.controller.updateBrand(req, res)
    );
    this.router.delete("/brands/:id", (req, res) =>
      this.controller.deleteProduct(req, res)
    );
  }
}
