import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserRoute } from "./user/user.routes";
import { ConfigServer } from "./config/config";
import { CategoryRoute } from "./category/category.routes";
import { ProductRoute } from "./product/product.routes";
import { OrderRoute } from "./order/order.routes";
import { AuthRoute } from "./auth/auth.routes";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { BrandRoute } from "./brand/brand.routes";
import { StockRoute } from "./stock/stock.routes";
import { SizeRoute } from "./size/size.routes";
import { ColorRoute } from "./colors/color.routes";
import { CartRoute } from "./cart/cart.routes";
import { CartItemRoute } from "./cart/cartItem.routes";
import { ImageRoute } from "./image/image.routes";
import { FavoriteRoute } from "./favorite/favorite.routes";

class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");

  constructor() {
    super();
    this.middlewares();
    this.cloudinaryConfig();
    this.dbConnect();
    this.app.use("/api", this.routes());
    this.listen();
  }

  async dbConnect(): Promise<DataSource | void> {
    return this.initConnect
      .then(() => {
        console.log("🚀 Success database connection");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public middlewares() {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  cloudinaryConfig() {
    cloudinary.config({
      cloud_name: this.getEnvironment("CLOUDINARY_NAME"),
      api_key: this.getEnvironment("CLOUDINARY_API_KEY"),
      api_secret: this.getEnvironment("CLOUDINARY_API_SECRET"),
    });
  }

  routes(): Array<express.Router> {
    return [
      new UserRoute().router,
      new CategoryRoute().router,
      new ProductRoute().router,
      new ImageRoute().router,
      new BrandRoute().router,
      new StockRoute().router,
      new SizeRoute().router,
      new ColorRoute().router,
      new OrderRoute().router,
      new AuthRoute().router,
      new CartRoute().router,
      new CartItemRoute().router,
      new FavoriteRoute().router,
    ];
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}

new ServerBootstrap();
