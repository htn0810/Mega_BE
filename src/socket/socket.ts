// routes/socket.js
import { Server } from "socket.io";
import { GET_DB } from "@configs/database";
import { ChatStatus, MessageType } from "@prisma/client";
import { corsConfig } from "@configs/cors";

const prisma = GET_DB();

export const initSocket = (httpServer: Express.Application) => {
  const io = new Server(httpServer, {
    cors: corsConfig,
  });

  // Store timestamp of heartbeat for each user
  const heartbeats = new Map();

  io.on("connection", (socket) => {
    console.log("User connected, bro:", socket.id);

    // Update user status when they connect
    socket.on(
      "setStatus",
      async ({ userId, status }: { userId: number; status: ChatStatus }) => {
        try {
          if (status === ChatStatus.OFFLINE) {
            heartbeats.delete(userId);
          }
          await prisma.users.update({
            where: { id: userId },
            data: { chatStatus: status, lastOnline: new Date() },
          });
          io.emit("statusUpdate", { userId, status });
        } catch (error) {
          socket.emit("error", { message: "Set status failed!" });
        }
      }
    );

    // Join conversation room
    socket.on(
      "joinConversation",
      ({ conversationId }: { conversationId: number }) => {
        socket.join(`conversation-${conversationId}`);
        console.log(`Socket ${socket.id} joined convo ${conversationId}`);
      }
    );

    // User join room của chính họ khi connect
    socket.on("registerUser", ({ userId }) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room user-${userId}`);
    });

    // Handle heartbeat
    socket.on("heartbeat", async ({ userId }) => {
      heartbeats.set(userId, Date.now());
      await prisma.users.update({
        where: { id: userId },
        data: { chatStatus: ChatStatus.ONLINE, lastOnline: new Date() },
      });
    });

    // Check heartbeat timeout each 30s
    setInterval(async () => {
      const now = Date.now();
      for (const [userId, lastPing] of heartbeats) {
        if (now - lastPing > 60000) {
          // 60s not ping -> offline
          await prisma.users.update({
            where: { id: userId },
            data: { chatStatus: ChatStatus.OFFLINE, lastOnline: new Date() },
          });
          heartbeats.delete(userId);
          io.emit("statusUpdate", { userId, status: ChatStatus.OFFLINE });
        }
      }
    }, 30000);

    // Send message
    socket.on(
      "sendMessage",
      async ({
        conversationId,
        senderId,
        content,
        type,
      }: {
        conversationId: number;
        senderId: number;
        content: string;
        type: MessageType;
      }) => {
        try {
          const message = await prisma.message.create({
            data: {
              conversationId,
              senderId,
              content,
              type,
              read: false,
            },
          });
          io.to(`conversation-${conversationId}`).emit("newMessage", message);
          const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
              participants: {
                select: {
                  userId: true,
                },
              },
            },
          });

          if (conversation) {
            const userIds = conversation.participants.map(
              (participant) => participant.userId
            );
            // Xác định user nhận (người không phải sender)
            const receiverId =
              senderId === userIds[0] ? userIds[1] : userIds[0];

            // Gửi thông báo chỉ tới user nhận
            io.to(`user-${receiverId}`).emit("newMessageNotification", {
              conversationId,
              message,
            });
          }
        } catch (error) {
          socket.emit("error", { message: "Send message failed!" });
        }
      }
    );

    // Typing indicator
    socket.on(
      "typing",
      ({
        conversationId,
        senderId,
      }: {
        conversationId: number;
        senderId: number;
      }) => {
        socket
          .to(`conversation-${conversationId}`)
          .emit("typing", { senderId });
      }
    );

    socket.on(
      "stopTyping",
      ({
        conversationId,
        senderId,
      }: {
        conversationId: number;
        senderId: number;
      }) => {
        socket
          .to(`conversation-${conversationId}`)
          .emit("stopTyping", { senderId });
      }
    );

    // Đọc tin nhắn
    socket.on(
      "readMessage",
      async ({
        senderId,
        conversationId,
      }: {
        senderId: number;
        conversationId: number;
      }) => {
        const messagesUnread = await prisma.message.findMany({
          where: {
            conversationId,
            read: false,
            senderId,
          },
        });

        await Promise.all(
          messagesUnread.map(async (message) => {
            await prisma.message.update({
              where: { id: message.id },
              data: { read: true },
            });
          })
        );

        io.to(`conversation-${conversationId}`).emit("messageRead", {
          senderId,
          conversationId,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected, bro:", socket.id);
    });
  });

  return io;
};
