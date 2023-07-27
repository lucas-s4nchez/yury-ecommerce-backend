import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { SizeService } from "../services/size.service";

@ValidatorConstraint({ name: "IsSizeUnique", async: true })
export class IsSizeUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly sizeService: SizeService) {}

  async validate(number: number, args: ValidationArguments) {
    const existingSize = await this.sizeService.findSizeByNumber(number);
    return !existingSize;
  }

  defaultMessage(args: ValidationArguments) {
    return `El talle '${args.value}' ya está registrado`;
  }
}

export function IsSizeUnique(validationOptions?: ValidationOptions) {
  const sizeService = new SizeService(); // Crear una instancia de SizeService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsSizeUniqueConstraint(sizeService), // Pasar la instancia de SizeService al constructor
    });
  };
}
