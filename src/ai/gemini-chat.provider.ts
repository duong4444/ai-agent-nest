import { Provider } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// khởi tạo gemini
// cung cấp ChatGoogleGenerativeAI
// cung cấp BaseChatModel
export const GeminiChatProvider: Provider = {
  provide: 'GEMINI_CHAT_MODEL',
  useFactory: () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not defined in your .env file. Ensure @nestjs/config is set up.',
      );
    }

    return new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemini-2.5-flash',
    });
  },
};
