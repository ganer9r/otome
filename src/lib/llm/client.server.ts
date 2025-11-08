import {
	CLOUDFLARE_AI_GATEWAY_URL,
	GOOGLE_API_KEY,
	OPENAI_API_KEY,
	ANTHROPIC_API_KEY,
	DEEPSEEK_API_KEY
} from '$env/static/private';
import { CloudflareAIClient } from './aiClient';
import type { EngineConfig } from './types';

/**
 * 모델명에서 제공자 추출 및 API 키 매핑
 */
function getApiKeyForModel(model: string): string {
	const provider = model.split('/')[0];

	const keyMap: Record<string, string | undefined> = {
		'google-ai-studio': GOOGLE_API_KEY,
		google: GOOGLE_API_KEY,
		openai: OPENAI_API_KEY,
		anthropic: ANTHROPIC_API_KEY,
		deepseek: DEEPSEEK_API_KEY
	};

	const apiKey = keyMap[provider];

	if (!apiKey) {
		throw new Error(
			`API key not found for provider: ${provider}. Please set ${provider.toUpperCase()}_API_KEY in .env`
		);
	}

	return apiKey;
}

/**
 * LLM 클라이언트 생성
 * @param model - 사용할 모델 (provider/model 형식)
 * @returns CloudflareAIClient 인스턴스
 */
export function createLLMClient(engine: EngineConfig): CloudflareAIClient {
	if (!CLOUDFLARE_AI_GATEWAY_URL) {
		throw new Error('CLOUDFLARE_AI_GATEWAY_URL is not set');
	}

	const apiKey = getApiKeyForModel(engine.model);

	return new CloudflareAIClient({
		gatewayUrl: CLOUDFLARE_AI_GATEWAY_URL,
		apiKey,
		engine
	});
}
