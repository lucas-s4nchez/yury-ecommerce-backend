import {
  IsEmail,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { UserService } from "../services/user.service";

@ValidatorConstraint({ name: "IsEmailUnique", async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string, args: ValidationArguments) {
    const user = await this.userService.findUserByEmail(email);
    return !user; // Devuelve verdadero si el email no está registrado, falso si está registrado
  }

  defaultMessage(args: ValidationArguments) {
    return `El email '${args.value}' ya está registrado`;
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  const userService = new UserService(); // Crear una instancia de UserService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsEmailUniqueConstraint(userService), // Pasar la instancia de UserService al constructor
    });
  };
}
