import { env } from "@configs/environments";
import { exceptionHandler } from "@middlewares/exceptionHandler";
import { API_ROUTER } from "@routes/index";
const cookieParser = require("cookie-parser");
import express, { Express } from "express";
import cors from "cors";
import { corsConfig } from "@configs/cors";
import { swaggerDocs } from "@utils/swagger";
import { createServer } from "http";
import { initSocket } from "@socket/socket";
const app: Express = express();

const port = Number(env.PORT) || 3000;
const hostName = env.HOST_NAME || "localhost";

const httpServer = createServer(app);
const io = initSocket(httpServer);

// Cors config
app.use(cors(corsConfig));

// Get cookies from request
app.use(cookieParser());

// Enable req.body json data
app.use(express.json());

app.use("/mega/v1", API_ROUTER);

app.use(exceptionHandler);

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://${hostName}:${port}`);

  swaggerDocs(app, port);
});
