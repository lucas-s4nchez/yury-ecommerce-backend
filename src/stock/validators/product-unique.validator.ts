import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator"; // Importa el servicio correspondiente para verificar la existencia del stock
import { StockService } from "../services/stock.service";

@ValidatorConstraint({ name: "IsProductUnique", async: true })
export class IsProductUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private stockService: StockService) {}

  async validate(product: any, args: ValidationArguments) {
    const existingStock = await this.stockService.findStockByProduct(product);
    return !existingStock; // Devuelve verdadero si no existe stock con el producto, falso si existe
  }

  defaultMessage(args: ValidationArguments) {
    return `Ya existe un stock registrado para el producto`;
  }
}

export function IsProductUnique(validationOptions?: ValidationOptions) {
  const stockService = new StockService(); // Crea una instancia del servicio de stock aquí

  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isProductUnique",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsProductUniqueConstraint(stockService), // Pasa la instancia del servicio de stock al constructor
    });
  };
}
