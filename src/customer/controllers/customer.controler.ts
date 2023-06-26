import { Request, Response } from "express";
import { DeleteResult, UpdateResult } from "typeorm";
import { CustomerService } from "../services/customer.service";
import { HttpResponse } from "../../shared/response/http.response";

export class CustomerController {
  constructor(
    private readonly customerService: CustomerService = new CustomerService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}
  async getCustomers(req: Request, res: Response) {
    try {
      const data = await this.customerService.findAllCustomers();
      if (data[0].length === 0) {
        return this.httpResponse.NotFound(res, "No existen customers");
      }
      const [customers, count] = data;
      return this.httpResponse.Ok(res, { customers, count });
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async getCustomerById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data = await this.customerService.findCustomerById(id);
      if (!data) {
        return this.httpResponse.NotFound(res, "No existe este customer");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async createCustomer(req: Request, res: Response) {
    try {
      const data = await this.customerService.createCustomer(req.body);
      if (!data) {
        this.httpResponse.BadRequest(
          res,
          "El usuario no existe o ya tiene el rol de 'CUSTOMER'"
        );
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      console.log(e);
      return this.httpResponse.Error(res, e);
    }
  }
  async updateCustomer(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: UpdateResult = await this.customerService.updateCustomer(
        id,
        req.body
      );
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al actualizar");
      }

      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
  async deleteCustomer(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const data: DeleteResult = await this.customerService.deleteCustomer(id);
      if (!data.affected) {
        return this.httpResponse.NotFound(res, "Error al eliminar");
      }
      return this.httpResponse.Ok(res, data);
    } catch (e) {
      return this.httpResponse.Error(res, e);
    }
  }
}
