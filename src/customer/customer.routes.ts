import { BaseRouter } from "../shared/router/router";
import { CustomerController } from "./controllers/customer.controler";

export class CustomerRoute extends BaseRouter<CustomerController> {
  constructor() {
    super(CustomerController); //Como 'BaseRouter' también ejecuta una funcion 'routes()' en su constructor, aquí ya se está ejecutanto la función de abajo
  }

  //Definir las rutas de customer
  routes(): void {
    this.router.get("/customers", (req, res) =>
      this.controller.getCustomers(req, res)
    );
    this.router.get("/customer/:id", (req, res) =>
      this.controller.getCustomerById(req, res)
    );
    this.router.post("/createCustomer", (req, res) =>
      this.controller.createCustomer(req, res)
    );
    this.router.put("/updateCustomer/:id", (req, res) =>
      this.controller.updateCustomer(req, res)
    );
    this.router.delete("/deleteCustomer/:id", (req, res) =>
      this.controller.deleteCustomer(req, res)
    );
  }
}
