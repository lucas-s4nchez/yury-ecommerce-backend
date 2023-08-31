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
    this.router.get(
      "/allProducts",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getAllProducts(req, res)
    );
    this.router.get(
      "/allProducts/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.getProductById(req, res)
    );
    this.router.get("/products", (req, res) =>
      this.controller.getAvailableProducts(req, res)
    );
    this.router.get("/featuredProducts", (req, res) =>
      this.controller.getFeaturedProducts(req, res)
    );
    this.router.get("/products/:id", (req, res) =>
      this.controller.getAvailableProductById(req, res)
    );
    this.router.get("/searchProducts", (req, res) =>
      this.controller.searchProducts(req, res)
    );
    this.router.post(
      "/products",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.productValidator.bind(this.middleware),
      (req, res) => this.controller.createProduct(req, res)
    );
    this.router.put(
      "/products/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      this.middleware.productUpdateValidator.bind(this.middleware),
      (req, res) => this.controller.updateProduct(req, res)
    );
    this.router.put(
      "/products/:id/isAvailable",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.productIsAvailable(req, res)
    );
    this.router.put(
      "/products/:id/isNotAvailable",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.productIsNotAvailable(req, res)
    );
    this.router.delete(
      "/products/:id",
      this.middleware.checkJsonWebToken,
      this.middleware.checkAdminRole.bind(this.middleware),
      (req, res) => this.controller.deleteProduct(req, res)
    );
  }
}
