import { CATEGORY_ROUTER } from "@routes/categoryRoute";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello World" });
});

router.use("/categories", CATEGORY_ROUTER);

export const API_ROUTER = router;
