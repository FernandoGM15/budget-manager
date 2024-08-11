import { env } from "bun";
import express, { type Application } from "express";
import morgan from "morgan";

class Server {
  private app!: Application;
  private PORT = env.port || 3000;

  constructor() {
    this.setConfig();
    this.setRoutes();
    this.start();
  }
  /**
   * @description Set express config
   */
  private setConfig = () => {
    this.app = express();
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
  };

  /**
   * @description Set project routes
   */
  private setRoutes = () => {};

  /**
   * @description start the express server and connect to database
   */
  private start = async () => {
    this.app.listen(this.PORT, () => {
      console.log(`Server running in port ${this.PORT}`);
    });
  };
}

export default new Server();
