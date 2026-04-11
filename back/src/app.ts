import express, { Express, Request } from "express";
import morgan from "morgan";
import sourceRouter from "./routes/song";
const app: Express = express();
import cors from "cors";
import { donwloadRouter } from "./routes/donwload";
import logger from "./utils/logger";
app.use(cors());
app.use(express.json());
//app.use(morgan('combined'))
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});

const stream = {
  write: (message: string) => logger.info(message.trim()),
};
app.use(morgan(":method :url :body", { stream }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", sourceRouter);
app.use("/api", donwloadRouter);

export default app;
