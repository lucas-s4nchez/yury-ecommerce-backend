import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { CategoryEntity } from "../../category/entities/category.entity";
import { IsProductUnique } from "../validators/product-unique.validator";
import { BrandEntity } from "../../brand/entities/brand.entity";
import { SizeDTO } from "../../size/dto/size.dto";

export class ProductDTO extends BaseDTO {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsProductUnique()
  name!: string;

  @IsNotEmpty({ message: "La descripción es requerida" })
  description!: string;

  @IsNotEmpty({ message: "El precio es requerido" })
  price!: number;

  @IsNotEmpty({ message: "La marca es requerida" })
  brand!: BrandEntity;

  @IsNotEmpty({ message: "La categoría es requerida" })
  category!: CategoryEntity;

  @ArrayNotEmpty({ message: "Se requiere al menos un talle" })
  @ValidateNested({ each: true })
  sizes!: SizeDTO[];
}
