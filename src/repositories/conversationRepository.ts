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
          messages: true,
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

  async createConversation(userId: number, otherUserId: number) {
    console.log(
      "🚀 ~ ConversationRepository ~ createConversation ~ otherUserId:",
      otherUserId
    );
    console.log(
      "🚀 ~ ConversationRepository ~ createConversation ~ userId:",
      userId
    );
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
      console.log(
        "🚀 ~ ConversationRepository ~ createConversation ~ error:",
        error
      );
      throw error;
    }
  }
}

const conversationRepository = new ConversationRepository();

export default conversationRepository;
