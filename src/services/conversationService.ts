import { NotFoundError } from "@exceptions/NotFoundError";
import conversationRepository from "@repositories/conversationRepository";

class ConversationService {
  async getConversations(userId: number) {
    try {
      const conversations = await conversationRepository.getConversations(
        userId
      );
      if (!conversations) {
        throw new NotFoundError("No conversations found");
      }
      return conversations;
    } catch (error) {
      throw error;
    }
  }

  async getConversationById(id: number) {
    try {
      const conversation = await conversationRepository.getConversationById(id);
      if (!conversation) {
        throw new NotFoundError("No conversation found");
      }
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async getConversationByUserId(userId: number) {
    try {
      const conversation = await conversationRepository.getConversationByUserId(
        userId
      );
      if (!conversation) {
        throw new NotFoundError("No conversation found");
      }
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async createConversation(userId: number, otherUserId: number) {
    try {
      const conversation = await conversationRepository.createConversation(
        userId,
        otherUserId
      );
      return conversation;
    } catch (error) {
      throw error;
    }
  }
}

const conversationService = new ConversationService();

export default conversationService;
