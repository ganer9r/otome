import type { EngineConfig, LLMResponse } from './types';

export class CloudflareAIClient {
	private accountId: string;
	private apiToken: string;
	private gatewayId: string;

	constructor(config: { accountId: string; apiToken: string; gatewayId: string }) {
		this.accountId = config.accountId;
		this.apiToken = config.apiToken;
		this.gatewayId = config.gatewayId;
	}

	async generate(
		messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
		engine: EngineConfig
	): Promise<LLMResponse> {
		const url = `https://gateway.ai.cloudflare.com/v1/${this.accountId}/${this.gatewayId}/workers-ai/${engine.model}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.apiToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				messages,
				temperature: engine.temperature ?? 0.7,
				max_tokens: engine.maxTokens ?? 2048,
				top_p: engine.topP ?? 1.0
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Cloudflare AI error: ${response.status} ${error}`);
		}

		const data = await response.json();

		return {
			content: data.result.response,
			model: engine.model,
			tokensUsed: data.result.usage?.total_tokens
		};
	}
}
