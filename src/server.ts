import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";

class ServerBootstrap {
  public app: express.Application = express();
  private port: number = 8080;

  constructor() {
    this.middlewares();
    this.listen();
  }

  public middlewares() {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}

new ServerBootstrap();
