import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserRoute } from "./users/user.routes";
import { ConfigServer } from "./config/config";
import { CategoryRoute } from "./category/category.routes";

class ServerBootstrap extends ConfigServer {
  public app: express.Application = express();
  private port: number = this.getNumberEnv("PORT");

  constructor() {
    super();
    this.middlewares();
    // this.dbConnection();
    this.app.use("/api", this.routes());
    this.listen();
  }

  public middlewares() {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  routes(): Array<express.Router> {
    return [new UserRoute().router];
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}

new ServerBootstrap();
