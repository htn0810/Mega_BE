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

  io.on("connection", (socket) => {
    console.log("User connected, bro:", socket.id);

    // Cập nhật trạng thái online
    socket.on(
      "setStatus",
      async ({ userId, status }: { userId: number; status: ChatStatus }) => {
        try {
          await prisma.users.update({
            where: { id: userId },
            data: { chatStatus: status, lastOnline: new Date() },
          });
          io.emit("statusUpdate", { userId, status });
        } catch (error) {
          console.log("🚀 ~ socket.on ~ error:", error);
          socket.emit("error", { message: "Set status failed!" });
        }
      }
    );

    // Tham gia phòng hội thoại
    socket.on(
      "joinConversation",
      ({ conversationId }: { conversationId: number }) => {
        socket.join(`conversation-${conversationId}`);
        console.log(`Socket ${socket.id} joined convo ${conversationId}`);
      }
    );

    // Gửi tin nhắn
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
        } catch (error) {
          console.log("🚀 ~ socket.on ~ error:", error);
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
        console.log(
          "🚀 ~ socket.on ~ conversationId:",
          conversationId,
          senderId
        );
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
        messageId,
        conversationId,
      }: {
        messageId: number;
        conversationId: number;
      }) => {
        console.log("🚀 ~ socket.on ~ messageId:", messageId);
        await prisma.message.update({
          where: { id: messageId },
          data: { read: true },
        });
        io.to(`conversation-${conversationId}`).emit("messageRead", {
          messageId,
          read: true,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected, bro:", socket.id);
    });
  });

  return io;
};
