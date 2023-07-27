import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
} from "class-validator";
import { ColorService } from "../../colors/services/color.service";

@ValidatorConstraint({ name: "IsValidColor", async: false })
export class IsValidColorConstraint implements ValidatorConstraintInterface {
  constructor(private readonly colorService: ColorService) {}

  async validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (!item || typeof item !== "object" || !item.id) {
        return false;
      }

      const color = await this.colorService.findColorById(item.id);
      if (!color) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `No se encontraron colores que coincidan con los proporcionados`;
  }
}

export function IsValidColor(validationOptions?: ValidationOptions) {
  const colorService = new ColorService(); // Crear una instancia de colorService aquí
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsValidColorConstraint(colorService),
    });
  };
}
