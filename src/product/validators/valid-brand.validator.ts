import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
} from "class-validator";
import { BrandService } from "../../brand/services/brand.service";

@ValidatorConstraint({ name: "IsValidBrand", async: false })
export class IsValidBrandConstraint implements ValidatorConstraintInterface {
  constructor(private readonly brandService: BrandService) {}

  async validate(category: string, args: ValidationArguments) {
    const existingBrand = await this.brandService.findBrandById(category);
    if (!existingBrand) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `No se encontraron marcas que coincidan con las proporcionadas`;
  }
}

export function IsValidBrand(validationOptions?: ValidationOptions) {
  const brandService = new BrandService(); // Crear una instancia de brandService aquí
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsValidBrandConstraint(brandService),
    });
  };
}
