import { env } from "@configs/environments";
import { exceptionHandler } from "@middlewares/exceptionHandler";
import { API_ROUTER } from "@routes/index";
const cookieParser = require("cookie-parser");
import express, { Express } from "express";

const app: Express = express();
const port = env.PORT || 3000;
const hostName = env.HOST_NAME || "localhost";

// Get cookies from request
app.use(cookieParser());

// Enable req.body json data
app.use(express.json());

app.use("/mega/v1", API_ROUTER);

app.use(exceptionHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${hostName}:${port}`);
});
