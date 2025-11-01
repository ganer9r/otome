export type LLMModel =
  | '@hf/thebloke/deepseek-coder-6.7b-instruct-awq'
  | '@cf/meta/llama-3.1-8b-instruct'
  | '@cf/mistral/mistral-7b-instruct-v0.1'
  | string;

export interface EngineConfig {
  model: LLMModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface LLMResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}
