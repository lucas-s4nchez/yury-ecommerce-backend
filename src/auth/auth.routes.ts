import { BaseRouter } from "../shared/router/router";
import { SharedMiddleware } from "../shared/middlewares/shared.middleware";
import { AuthController } from "./controllers/auth.controller";

export class AuthRoute extends BaseRouter<AuthController, SharedMiddleware> {
  constructor() {
    super(AuthController, SharedMiddleware); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de usuario
  routes(): void {
    this.router.post("/login", (req, res) => this.controller.login(req, res));
  }
}
