import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
/**
 * 'chat_history': LangChain sẽ tự động điền lịch sử trò chuyện 
 * (từ BufferMemory có memoryKey='chat_history') vào vị trí này.
 */

export const interactiveAgentPromptTemplate = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `Trả lời một các ngắn gọn và súc tích. Nếu bạn cần dùng công cụ, hãy suy nghĩ cẩn thận..
    Bạn có thể sử dụng các công cụ sau để hỗ trợ người dùng:
    {tool_names}
    Chi tiết từng công cụ:
    {tools}`,
  ),
  new MessagesPlaceholder('chat_history'),
  ['human', 'Câu hỏi của người dùng: {input} \n\n {agent_scratchpad}'],
  /**
   * 'agent_scratchpad': Đây là không gian làm việc nội bộ của Agent. 
   * Khi Agent quyết định sử dụng một Tool, các bước suy nghĩ, tên Tool được gọi,
   *  và kết quả từ Tool sẽ được đưa vào đây để LLM tiếp tục xử lý.
   */
]);
