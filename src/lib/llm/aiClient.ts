import type { EngineConfig, LLMResponse } from './types';

/**
 * Cloudflare AI Gateway Client
 * OpenAI 호환 chat completions API 사용
 */
export class CloudflareAIClient {
	private gatewayUrl: string;
	private apiKey: string;

	constructor(config: { gatewayUrl: string; apiKey: string }) {
		this.gatewayUrl = config.gatewayUrl;
		this.apiKey = config.apiKey;
	}

	async generate(
		messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
		engine: EngineConfig
	): Promise<LLMResponse> {
		// OpenAI 호환 chat completions 엔드포인트
		const url = `${this.gatewayUrl}/compat/chat/completions`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: engine.model, // provider/model 형식 (예: google-ai-studio/gemini-2.5-flash)
				messages,
				temperature: engine.temperature ?? 0.7,
				max_tokens: engine.maxTokens ?? 2048,
				top_p: engine.topP ?? 1.0
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Cloudflare AI Gateway error: ${response.status} ${error}`);
		}

		const data = await response.json();

		// OpenAI 호환 응답 형식
		return {
			content: data.choices[0].message.content,
			model: engine.model,
			tokensUsed: data.usage?.total_tokens
		};
	}
}
