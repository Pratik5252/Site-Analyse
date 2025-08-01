import { CustomRequest } from "../../middleware/auth.js";
import { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import prisma from "../../prisma/prismaClient.js";

export const getMeContoller = async (req: CustomRequest, res: Response) => {
  try {
    const userId = (req.user as JwtPayload & { userId: string }).userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);

    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
