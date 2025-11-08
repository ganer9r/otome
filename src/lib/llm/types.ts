/**
 * AI Gateway 모델 형식: provider/model
 * 예: google-ai-studio/gemini-2.5-flash, openai/gpt-4-mini
 */
export type LLMModel =
	| 'google-ai-studio/gemini-2.5-flash'
	| 'google-ai-studio/gemini-2.5-pro'
	| 'openai/gpt-4o-mini'
	| 'anthropic/claude-sonnet-4-5'
	| 'deepseek/deepseek-chat'
	| 'deepseek/deepseek-reasoner'
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
