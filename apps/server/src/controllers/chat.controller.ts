import { auth } from "@scaleable-chat-app/auth";
import prisma from "@scaleable-chat-app/db";
import { fromNodeHeaders } from "better-auth/node";
import { type Request, type Response } from "express";

interface GroupUserType {
  group_id: string;
  passcode: string;
}

export class ChatGroupController {
  // Get All
  static async index(req: Request, res: Response) {
    try {
      const data = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (data) {
        const user = data.user;

        const groups = await prisma.chatGroup.findMany({
          where: { owner_id: user.id },
          orderBy: { createdAt: "desc" },
        });

        return res.json({
          message: "Chat groups fetched successfully!",
          data: groups,
        });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Get One
  static async show(req: Request, res: Response) {
    try {
      const data = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!data?.user) {
        return res.status(401).json({ error: "Unauthorized!" });
      }

      const { id } = req.params;
      const userId = data.user.id;

      const group = await prisma.chatGroup.findUnique({
        where: { id: id },
        include: {
          groupUsers: true,
        },
      });

      if (!group) {
        return res.status(404).json({ message: "Chat group not found!" });
      }

      // Check if user is owner OR if user exists in the groupUsers array
      const isOwner = group.owner_id === userId;
      const isMember = group.groupUsers.some(
        (member) => member.user_id === userId
      );

      if (!isOwner && !isMember) {
        return res
          .status(403)
          .json({ message: "You do not have access to this group!" });
      }

      return res.json({
        message: "Chat group fetched successfully!",
        data: group,
      });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Create
  static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const data = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (data) {
        const user = data?.user;

        await prisma.chatGroup.create({
          data: {
            title: body.title,
            passcode: body.passcode,
            owner_id: user?.id,
          },
        });

        return res.json({ message: "Chat group created successfully!" });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Update
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (data) {
        const user = data.user;

        await prisma.chatGroup.update({
          where: {
            id: id,
            owner_id: user.id,
          },
          data: { title: body.title, passcode: body.passcode },
        });

        return res.json({ message: "Chat group updated successfully!" });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Delete
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (data) {
        await prisma.chatGroup.delete({
          where: { id: id, owner_id: data.user.id },
        });

        return res.json({
          message: "Chat group deleted successfully!",
        });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      return res.status(500).json({ message: "Somethign went wrong!" });
    }
  }

  // Join user to room
  static async join_room(req: Request, res: Response) {
    try {
      const body: GroupUserType = req.body;

      const data = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (data) {
        const userId = data?.user.id;

        const chat_group = await prisma.chatGroup.findUnique({
          where: { id: body.group_id },
        });

        if (!chat_group) {
          return res.status(404).json({ message: "Chat group not found." });
        }

        if (chat_group.passcode !== body.passcode) {
          return res.status(401).json({ message: "Invalid passcode." });
        }

        const existingMembership = await prisma.groupUsers.findUnique({
          where: {
            group_id_user_id: {
              group_id: body.group_id,
              user_id: userId,
            },
          },
        });

        if (existingMembership) {
          return res
            .status(400)
            .json({ message: "You are already a member of this group." });
        }

        await prisma.groupUsers.create({
          data: {
            group_id: body.group_id,
            user_id: userId,
            role: "member",
          },
        });

        return res.status(201).json({ message: "Group joined successfully!" });
      }
      return res.status(401).json({ error: "Unauthorized!" });
    } catch (error) {
      console.error("Join Room Error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
