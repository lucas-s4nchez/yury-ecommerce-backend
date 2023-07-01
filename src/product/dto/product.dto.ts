import { IsNotEmpty } from "class-validator";
import { BaseDTO } from "../../config/base.dto";
import { CategoryEntity } from "../../category/entities/category.entity";
import { IsProductUnique } from "../validators/product-unique.validator";
import { BrandEntity } from "../entities/brand.entity";

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
}
