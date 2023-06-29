import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { IsCategoryUnique } from "../validators/category-unique.validator";

export class CategoryDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "Tipo de dato incorrecto" })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "Solo se permiten letras",
  })
  @Length(3, 50, { message: "El nombre debe tener entre 3 y 50 caracteres" })
  @IsCategoryUnique()
  name!: string;
}
