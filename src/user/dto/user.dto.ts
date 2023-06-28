import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength,
} from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { RoleType } from "../types/role.types";
import { IsEmailUnique } from "../validators/email-unique.validator";
import { IsUsernameUnique } from "../validators/username-unique.validator";

export class UserDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  name!: string;

  @IsNotEmpty({ message: "El apellido es requerido" })
  lastName!: string;

  @IsNotEmpty({ message: "El nombre de usuario es requerido" })
  @Length(3, 20, {
    message: "El nombre de usuario debe tener entre 3 y 20 caracteres",
  })
  @IsUsernameUnique()
  username!: string;

  @IsNotEmpty({ message: "El email es requerido" })
  @IsEmail({}, { message: "El email debe tener un formato válido" })
  @MaxLength(100, { message: "El email no puede exceder los 100 caracteres" })
  @IsEmailUnique()
  email!: string;

  @IsNotEmpty({ message: "La contraseña es requerida" })
  @IsAlphanumeric("es-ES", {
    message: "La contraseña solo puede contener letras y números",
  })
  @Length(8, 20, {
    message: "La contraseña debe tener entre 8 y 20 caracteres",
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
    message:
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número",
  })
  password!: string;

  @IsOptional()
  @IsEnum(RoleType, { message: "El valor del rol no es válido" })
  role!: RoleType;
}
