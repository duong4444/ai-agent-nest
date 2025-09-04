import { Injectable, Inject } from '@nestjs/common';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { interactiveAgentPromptTemplate } from '../prompts/interactive-agent.prompt'; // Import template
import { GetTimeTool } from '../tools/get-time.tool'; // Import tool vừa tạo

@Injectable()
export class InteractiveAgentService {
  private agentExecutor: AgentExecutor;
  private memory: BufferMemory;

  // llm là LLM - inject GEMINI_CHAT_MODEL
  constructor(
    @Inject('GEMINI_CHAT_MODEL') private readonly llm: BaseChatModel,
  ) {
    // lưu lại lịch sử hội thoại chat_history
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
      inputKey: 'input',
      outputKey: 'output',
    });
  }

  // khởi tại agent
  async onModuleInit() {
    // const prompt = ChatPromptTemplate.fromMessages([
    //   // System Message - Defines the AI's role and available tools
    //   SystemMessagePromptTemplate.fromTemplate(
    //     `Bạn là một trợ lý AI thông minh.
    //     Bạn có thể sử dụng các công cụ sau để hỗ trợ người dùng:
    //     {tool_names}
    //     Chi tiết từng công cụ:
    //     {tools}`,
    //   ),
    //   // nhúng lịch sử hội thoại vào prompt
    //   new MessagesPlaceholder('chat_history'),
    //   // message template trong LangChain tương ứng vs 1 'humman message'
    //   // {input}: câu hỏi thực tế của user , dữ liệu user nhập
    //   // {agent_scratchpad}: nơi agent ghi lại lập luận trung gian
    //   // ex: nếu AI gọi công cụ, nó sẽ viết "Tôi cần tra cứu công cụ Search với từ khóa ‘trồng lúa’”
    //   // khi tool trả kết quả , scratchpad lưu lại kqua đó để AI tiếp tục suy nghĩ

    //   // Human Message Template
    //   ['human', '{input} \n\n {agent_scratchpad}'],
    //   // reasoning là quá trình AI suy luận theo từng bước
    //   /**Ví dụ user hỏi:
    //   "5 nhân với 12 bằng bao nhiêu, rồi cộng thêm 7?"
    //   AI agent sẽ reasoning như sau (trong scratchpad):
    //   Input: "5 × 12 + 7"
    //   Step 1: Nhận ra cần tính 5 × 12 = 60.
    //   Step 2: Lấy kết quả 60, cộng thêm 7 = 67.
    //   Output: "Kết quả là 67."
    //   Nếu agent có tools (máy tính, tìm kiếm Google,...), reasoning sẽ gồm cả việc:
    //   Quyết định gọi tool nào.
    //   Gửi query đến tool.
    //   Nhận kết quả và suy nghĩ tiếp. */
    // ]);

    // thêm tool như Calculator,Search,API riêng
    const prompt = interactiveAgentPromptTemplate; // Sử dụng template đã import
    
    const tools = [GetTimeTool];
    // tạo agent biết cách dùng tool + LLM
    const agent = await createStructuredChatAgent({
      llm: this.llm,
      tools,  // truyền tools vào agent
      prompt, // truyền template vào agent
    });

    // quản lý agent + tools + memory
    this.agentExecutor = new AgentExecutor({
      agent,
      tools, // AgentExecutor cũng cần biết về tools để thực thi tool
      memory: this.memory,
      verbose: true, // log chi tiết quá trình reasoning
      handleParsingErrors: true, // tránh crash khi AI trả về JSON sai định dạng
    });
  }

  async interact(userInput: string): Promise<string> {
    console.log('User input:', userInput);
    const response = await this.agentExecutor.invoke({
      input: userInput,
    });
    return response.output;
  }
}
// agent_scratchpad: Space for the agent's intermediate reasoning steps
// chat_history: Maintained by BufferMemory for conversation context
// tools: External capabilities the agent can use (currently empty)
// verbose: Enables detailed logging of agent's reasoning
// handleParsingErrors: Prevents crashes from malformed JSON responses

// tool_names = liệt kê tên các công cụ mà agent có thể dùng.
// tools = phần hướng dẫn chi tiết cách dùng công cụ đó.
