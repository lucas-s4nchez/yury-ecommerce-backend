import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import {
  CreateUserDTO,
  UpdateAdvancedUserDTO,
  UpdateBasicUserDTO,
} from "../dto/user.dto";

export class UserMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  createUserValidator(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, username, email, password, role } = req.body;
    const validUser = new CreateUserDTO();

    validUser.name = name;
    validUser.lastName = lastName;
    validUser.username = username;
    validUser.email = email;
    validUser.password = password;
    validUser.role = role;

    validate(validUser).then((err) => {
      if (err.length > 0) {
        const formattedErrors = err.map((error) => ({
          property: error.property,
          errors: Object.keys(error.constraints!).map(
            (key) => error.constraints![key]
          ),
        }));
        return this.httpResponse.BadRequest(res, formattedErrors);
      } else {
        next();
      }
    });
  }
  updateBasicUserValidator(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, username, email, password, role } = req.body;
    const validUser = new UpdateBasicUserDTO();

    validUser.name = name;
    validUser.lastName = lastName;
    validUser.username = username;
    validUser.email = email;
    validUser.password = password;

    validate(validUser).then((err) => {
      if (err.length > 0) {
        const formattedErrors = err.map((error) => ({
          property: error.property,
          errors: Object.keys(error.constraints!).map(
            (key) => error.constraints![key]
          ),
        }));
        return this.httpResponse.BadRequest(res, formattedErrors);
      } else {
        next();
      }
    });
  }
  updateAdvancedUserValidator(req: Request, res: Response, next: NextFunction) {
    const { province, city, address, dni, phone } = req.body;
    const validUser = new UpdateAdvancedUserDTO();

    validUser.province = province;
    validUser.city = city;
    validUser.address = address;
    validUser.dni = dni;
    validUser.phone = phone;

    validate(validUser).then((err) => {
      if (err.length > 0) {
        const formattedErrors = err.map((error) => ({
          property: error.property,
          errors: Object.keys(error.constraints!).map(
            (key) => error.constraints![key]
          ),
        }));
        return this.httpResponse.BadRequest(res, formattedErrors);
      } else {
        next();
      }
    });
  }
}
