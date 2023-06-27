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
import { OrderItemRoute } from "./order/order-item.routes";

class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");

  constructor() {
    super();
    this.middlewares();
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
  }

  routes(): Array<express.Router> {
    return [
      new UserRoute().router,
      new CategoryRoute().router,
      new ProductRoute().router,
      new OrderRoute().router,
      new OrderItemRoute().router,
    ];
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}

new ServerBootstrap();
