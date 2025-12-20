import { auth } from "@scaleable-chat-app/auth";
import { fromNodeHeaders } from "better-auth/node";
import { type NextFunction, type Request, type Response } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session || !session.user) {
    {
      return res.status(401).json({ error: "Unauthorized!" });
    }
  }
  next();
}
