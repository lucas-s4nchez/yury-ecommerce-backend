import { CategoryController } from "./controllers/category.controller";
import { BaseRouter } from "../shared/router/router";
import { CategoryMiddleware } from "./middlewares/category.midleware";

export class CategoryRoute extends BaseRouter<
  CategoryController,
  CategoryMiddleware
> {
  constructor() {
    super(CategoryController, CategoryMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de categoria
  routes(): void {
    this.router.get("/categories", (req, res) =>
      this.controller.getCategories(req, res)
    );
    this.router.get("/category/:id", (req, res) =>
      this.controller.getCategoryById(req, res)
    );
    this.router.post("/createCategory", (req, res) =>
      this.controller.createCategory(req, res)
    );
    this.router.put("/updateCategory/:id", (req, res) =>
      this.controller.updateCategory(req, res)
    );
    this.router.delete("/deleteCategory/:id", (req, res) =>
      this.controller.deleteCategory(req, res)
    );
  }
}
