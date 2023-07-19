import { DeleteResult } from "typeorm";
import { BaseService } from "../../config/base.service";
import { FavoriteDTO } from "../dto/favorite.dto";
import { FavoriteEntity } from "../entities/favorite.entity";
import { OrderType } from "../../shared/types/shared.types";

export class FavoriteService extends BaseService<FavoriteEntity> {
  constructor() {
    super(FavoriteEntity);
  }

  async findAllFavoritesAndPaginate(
    page: number,
    limit: number,
    order: OrderType
  ): Promise<[FavoriteEntity[], number, number]> {
    const skipCount = (page - 1) * limit;
    const [favorites, count] = await (await this.execRepository)
      .createQueryBuilder("favorites")
      .orderBy("favorites.createdAt", order)
      .skip(skipCount)
      .take(limit)
      .where({ state: true })
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return [favorites, count, totalPages];
  }

  async findFavoriteById(id: string): Promise<FavoriteEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("favorite")
      .where({ id, state: true })
      .getOne();
  }

  async findFavoriteByIdForDelete(id: string): Promise<FavoriteEntity | null> {
    return (await this.execRepository)
      .createQueryBuilder("favorite")
      .leftJoinAndSelect("favorite.product", "product")
      .where({ id, state: true })
      .getOne();
  }

  async createFavorite(body: FavoriteDTO): Promise<FavoriteEntity> {
    return (await this.execRepository).save(body);
  }

  async deleteFavorite(id: string): Promise<DeleteResult> {
    return (await this.execRepository).delete({ id });
  }
}
