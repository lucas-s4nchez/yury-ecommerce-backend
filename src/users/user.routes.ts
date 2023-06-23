import { UserController } from "./controllers/user.controller";
import { BaseRouter } from "../shared/router/router";

export class UserRoute extends BaseRouter<UserController> {
  constructor() {
    super(UserController); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de usuario
  routes(): void {
    this.router.get("/users", (req, res) => this.controller.getUser(req, res));
    this.router.get("/user/:id", (req, res) =>
      this.controller.getUserById(req, res)
    );
    this.router.post("/createUser", (req, res) =>
      this.controller.createUser(req, res)
    );
    this.router.put("/updateUser/:id", (req, res) =>
      this.controller.updateUser(req, res)
    );
    this.router.delete("/deleteUser/:id", (req, res) =>
      this.controller.deleteUser(req, res)
    );
  }
}
