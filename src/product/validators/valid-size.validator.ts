import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
} from "class-validator";
import { SizeService } from "../../size/services/size.service";

@ValidatorConstraint({ name: "IsValidSize", async: false })
export class IsValidSizeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly sizeService: SizeService) {}

  async validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (!item || typeof item !== "object" || !item.id) {
        return false;
      }

      const size = await this.sizeService.findSizeById(item.id);
      if (!size) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `No se encontraron talles que coincidan con los proporcionados`;
  }
}

export function IsValidSize(validationOptions?: ValidationOptions) {
  const sizeService = new SizeService(); // Crear una instancia de sizeService aquí
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsValidSizeConstraint(sizeService),
    });
  };
}
