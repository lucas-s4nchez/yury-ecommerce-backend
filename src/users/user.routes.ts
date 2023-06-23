import { UserController } from "./controllers/user.controller";
import { BaseRouter } from "../shared/router/router";

export class UserRoute extends BaseRouter<UserController> {
  constructor() {
    super(UserController); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de usuario
  routes(): void {
    this.router.get("/user", (req, res) => this.controller.getUser(req, res));
  }
}
