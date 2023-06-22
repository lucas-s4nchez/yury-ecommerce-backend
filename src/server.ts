import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import { UserRoute } from "./router/user.routes";

class ServerBootstrap {
  public app: express.Application = express();
  private port: number = 8080;

  constructor() {
    this.middlewares();

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
