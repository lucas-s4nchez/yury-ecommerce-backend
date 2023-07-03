import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { ColorService } from "../services/color.service";

@ValidatorConstraint({ name: "IsColorUnique", async: true })
export class IsColorUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly colorService: ColorService) {}

  async validate(name: string, args: ValidationArguments) {
    const existingColor = await this.colorService.findColorByName(name);
    return !existingColor;
  }

  defaultMessage(args: ValidationArguments) {
    return `El color '${args.value}' ya está registrado`;
  }
}

export function IsColorUnique(validationOptions?: ValidationOptions) {
  const colorService = new ColorService(); // Crear una instancia de ColorService aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsColorUniqueConstraint(colorService), // Pasar la instancia de ColorService al constructor
    });
  };
}
