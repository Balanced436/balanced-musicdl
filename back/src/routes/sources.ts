import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const sourceRouter = Router();

sourceRouter.get("/source/:id?", async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    return res.status(200).json(await prisma.source.findMany())
    },
);

export default sourceRouter;
