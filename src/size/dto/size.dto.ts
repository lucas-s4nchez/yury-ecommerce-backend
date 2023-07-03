import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { IsSizeUnique } from "../validators/size-unique.validator";

export class SizeDTO extends BaseDTO {
  @IsNotEmpty({ message: "El número es requerido" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 },
    {
      message:
        "El número debe ser un valor numérico (máximo 1 decimal en el número)",
    }
  )
  @Min(1, { message: "El número debe ser mayor o igual a 1" })
  @IsSizeUnique()
  number!: number;
}

export class UpdateSizeDTO extends BaseDTO {
  @IsNotEmpty({ message: "El número es requerido" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 },
    { message: "El número debe ser un valor numérico" }
  )
  number!: number;
}
