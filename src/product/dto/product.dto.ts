import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { CategoryEntity } from "../../category/entities/category.entity";
import { IsProductUnique } from "../validators/product-unique.validator";
import { BrandEntity } from "../../brand/entities/brand.entity";
import { Type } from "class-transformer";
import { SizeEntity } from "../../size/entities/size.entity";
import { ColorEntity } from "../../colors/entities/color.entity";
import { IsValidSize } from "../validators/valid-size.validator";
import { IsValidColor } from "../validators/valid-color.validator";
import { IsValidCategory } from "../validators/valid-category.validator";
import { IsValidBrand } from "../validators/valid-brand.validator";
import { GenderType } from "../types/Gender";

export class ProductDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @MaxLength(255, {
    message: "El nombre puede tener como máximo 255 caracteres",
  })
  @IsProductUnique()
  name!: string;

  @IsNotEmpty({ message: "La descripción es requerida" })
  @MaxLength(255, {
    message: "La descripción puede tener como máximo 255 caracteres",
  })
  description!: string;

  @IsNotEmpty({ message: "El precio es requerido" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { message: "El precio debe ser un número" }
  )
  @Min(1, { message: "El precio mínimo debe ser de $1" })
  price!: number;

  @IsBoolean({ message: "El campo 'featured' debe ser un booleano" })
  @IsOptional()
  featured?: boolean;

  @IsBoolean({ message: "El campo 'available' debe ser un booleano" })
  @IsOptional()
  available?: boolean;

  @IsNotEmpty({ message: "La marca es requerida" })
  @IsValidBrand()
  brand!: BrandEntity;

  @IsNotEmpty({ message: "La categoría es requerida" })
  @IsValidCategory()
  category!: CategoryEntity;

  @ValidateNested({ each: true, message: "Debe ser un array de talles" })
  @Type(() => SizeEntity)
  @ArrayNotEmpty({ message: "Debe seleccionar al menos un talle" })
  @IsValidSize()
  sizes!: SizeEntity[];

  @ValidateNested({ each: true, message: "Debe ser un array de colores" })
  @Type(() => ColorEntity)
  @ArrayNotEmpty({ message: "Debe seleccionar al menos un color" })
  @IsValidColor()
  colors!: ColorEntity[];

  @IsNotEmpty({ message: "El género es requerido" })
  @IsEnum(GenderType, { message: "El género no es válido" })
  gender!: GenderType;
}

export class UpdateProductDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  name!: string;

  @IsNotEmpty({ message: "La descripción es requerida" })
  description!: string;

  @IsNotEmpty({ message: "El precio es requerido" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { message: "El precio debe ser un número" }
  )
  @Min(1, { message: "El precio mínimo debe ser de $1" })
  price!: number;

  @IsBoolean({ message: "El campo 'featured' debe ser un booleano" })
  @IsOptional()
  featured?: boolean;

  @IsBoolean({ message: "El campo 'available' debe ser un booleano" })
  @IsOptional()
  available?: boolean;

  @IsNotEmpty({ message: "La marca es requerida" })
  @IsValidBrand()
  brand!: BrandEntity;

  @IsNotEmpty({ message: "La categoría es requerida" })
  @IsValidCategory()
  category!: CategoryEntity;

  @ValidateNested({ each: true, message: "Debe ser un array de talles" })
  @Type(() => SizeEntity)
  @ArrayNotEmpty({ message: "Debe seleccionar al menos un talle" })
  @IsValidSize()
  sizes!: SizeEntity[];

  @ValidateNested({ each: true, message: "Debe ser un array de colores" })
  @Type(() => ColorEntity)
  @ArrayNotEmpty({ message: "Debe seleccionar al menos un color" })
  @IsValidColor()
  colors!: ColorEntity[];

  @IsNotEmpty({ message: "El género es requerido" })
  @IsEnum(GenderType, { message: "El género no es válido" })
  gender!: GenderType;
}
export class AvailableProductDTO extends BaseDTO {
  @IsBoolean({ message: "El campo 'available' debe ser un booleano" })
  @IsNotEmpty({ message: "El campo 'available' es requerido" })
  available!: boolean;
}
