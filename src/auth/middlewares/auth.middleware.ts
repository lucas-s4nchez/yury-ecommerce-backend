import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { NextFunction, Request, Response } from "express";
import { LoginUserDTO, RegisterUserDTO } from "../dto/auth.dto";

export class AuthMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  loginValidator(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const validUser = new LoginUserDTO();

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

  registerValidator(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, email, password, role } = req.body;
    const validUser = new RegisterUserDTO();

    validUser.name = name;
    validUser.lastName = lastName;
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
}
