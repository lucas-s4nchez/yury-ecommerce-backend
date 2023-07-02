import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseDTO } from "../../config/base.dto";

export class SizeDTO extends BaseDTO {
  @IsNotEmpty({ message: "El número es requerido" })
  @IsNumber(
    { allowNaN: false },
    { message: "El número debe ser un valor numérico" }
  )
  number!: number;
}
