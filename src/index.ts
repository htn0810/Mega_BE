import { env } from "@configs/environments";
import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = env.PORT || 3000;
const hostName = env.HOST_NAME || "localhost";

app.get("/", (req: Request, res: Response) => {
  console.log("DB connected");
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${hostName}:${port}`);
});
