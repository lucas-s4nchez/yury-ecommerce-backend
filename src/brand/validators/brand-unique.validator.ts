import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { BrandService } from "../services/brand.service";

@ValidatorConstraint({ name: "IsBrandUnique", async: true })
export class IsBrandUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly brandService: BrandService) {}

  async validate(name: string, args: ValidationArguments) {
    const brand = await this.brandService.findBrandByName(name);
    return !brand; // Devuelve verdadero si el name no está registrado, falso si está registrado
  }

  defaultMessage(args: ValidationArguments) {
    return `La marca '${args.value}' ya está registrada`;
  }
}

export function IsBrandUnique(validationOptions?: ValidationOptions) {
  const brandService = new BrandService(); // Crear una instancia de brandService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsBrandUniqueConstraint(brandService), // Pasar la instancia de brandService al constructor
    });
  };
}
