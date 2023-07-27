import { validate } from "class-validator";
import { SharedMiddleware } from "../../shared/middlewares/shared.middleware";
import { NextFunction, Request, Response } from "express";
import {
  LoginUserDTO,
  RegisterUserDTO,
  UpdateAdvancedUserDTO,
  UpdateEmailDTO,
  UpdateLastNameDTO,
  UpdateNameDTO,
  UpdatePasswordDTO,
} from "../dto/auth.dto";

export class AuthMiddleware extends SharedMiddleware {
  constructor() {
    super();
  }

  loginValidator(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const validUser = new LoginUserDTO();

    validUser.email = email.trim();
    validUser.password = password.trim();

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

    validUser.name = name.trim();
    validUser.lastName = lastName.trim();
    validUser.email = email.trim();
    validUser.password = password.trim();
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

  updateNameValidator(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;
    const validName = new UpdateNameDTO();

    validName.name = name.trim();

    validate(validName).then((err) => {
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

  updateLastNameValidator(req: Request, res: Response, next: NextFunction) {
    const { lastName } = req.body;
    const validLastName = new UpdateLastNameDTO();

    validLastName.lastName = lastName.trim();

    validate(validLastName).then((err) => {
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

  updateEmailValidator(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const validEmail = new UpdateEmailDTO();

    validEmail.email = email.trim();

    validate(validEmail).then((err) => {
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

  updatePasswordValidator(req: Request, res: Response, next: NextFunction) {
    const { oldPassword, password } = req.body;
    const validPassword = new UpdatePasswordDTO();

    validPassword.oldPassword = oldPassword.trim();
    validPassword.password = password.trim();

    validate(validPassword).then((err) => {
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

    validUser.province = province.trim();
    validUser.city = city.trim();
    validUser.address = address.trim();
    validUser.dni = dni.trim();
    validUser.phone = phone.trim();

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
