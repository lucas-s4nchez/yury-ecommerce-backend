import { CategoryController } from "./controllers/category.controller";
import { BaseRouter } from "../shared/router/router";

export class CategoryRoute extends BaseRouter<CategoryController> {
  constructor() {
    super(CategoryController); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de categoria
  routes(): void {
    this.router.get("/categories", (req, res) =>
      this.controller.getCategories(req, res)
    );
  }
}
