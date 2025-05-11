import { GET_DB } from "@configs/database";

class ConversationRepository {
  async getConversations(userId: number) {
    try {
      const conversations = await GET_DB().conversation.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
          participants: {
            include: {
              user: true,
            },
          },
        },
      });
      return conversations;
    } catch (error) {
      throw error;
    }
  }

  async getConversationById(id: number) {
    try {
      const conversation = await GET_DB().conversation.findUnique({
        where: { id },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async getConversationByUserId(userId: number) {
    try {
      const conversations = await GET_DB().conversation.findMany({
        where: {
          participants: {
            some: { userId },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                include: {
                  shop: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return conversations;
    } catch (error) {
      throw error;
    }
  }

  async createConversation(userId: number, otherUserId: number) {
    try {
      const conversation = await GET_DB().conversation.create({
        data: {
          participants: {
            create: [{ userId }, { userId: otherUserId }],
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });
      return conversation;
    } catch (error) {
      throw error;
    }
  }
}

const conversationRepository = new ConversationRepository();

export default conversationRepository;
