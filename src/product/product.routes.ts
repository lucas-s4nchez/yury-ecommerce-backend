import { BaseRouter } from "../shared/router/router";
import { ProductController } from "./controllers/product.controller";
import { ProductMiddleware } from "./middlewares/product.middleware";

export class ProductRoute extends BaseRouter<
  ProductController,
  ProductMiddleware
> {
  constructor() {
    super(ProductController, ProductMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de producto
  routes(): void {
    this.router.get("/productList", (req, res) =>
      this.controller.productList(req, res)
    );
    this.router.get("/products", (req, res) =>
      this.controller.getProducts(req, res)
    );
    this.router.get("/products/:id", (req, res) =>
      this.controller.getProductById(req, res)
    );
    this.router.post(
      "/products",
      this.middleware.productValidator.bind(this.middleware),
      (req, res) => this.controller.createProduct(req, res)
    );
    this.router.put(
      "/products/:id",
      this.middleware.productUpdateValidator.bind(this.middleware),
      (req, res) => this.controller.updateProduct(req, res)
    );
    this.router.put("/products/:id/isAvailable", (req, res) =>
      this.controller.productIsAvailable(req, res)
    );
    this.router.put("/products/:id/isNotAvailable", (req, res) =>
      this.controller.productIsNotAvailable(req, res)
    );
    this.router.delete("/products/:id", (req, res) =>
      this.controller.deleteProduct(req, res)
    );
  }
}
