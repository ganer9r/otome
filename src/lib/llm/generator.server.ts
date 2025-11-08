import type { EngineConfig } from './types';
import { createLLMClient } from './client.server';

export type Message = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

/**
 * LLM을 통해 콘텐츠를 생성하고 파싱하는 범용 함수
 * @template T - 파싱된 데이터의 타입
 */
export async function generateFromLLM<T>(params: {
	engine: EngineConfig;
	messages: Message[];
	parser: (content: string) => T;
}): Promise<{ data: T; model: string }> {
	const { engine, messages, parser } = params;

	// 1. LLM 클라이언트 생성
	const client = createLLMClient(engine);

	// 2. LLM 호출
	let result;
	try {
		result = await client.generate(messages);
	} catch (error) {
		throw new Error(
			`LLM generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}

	// 3. 응답 파싱
	try {
		const data = parser(result.content);
		return { data, model: result.model };
	} catch (error) {
		throw new Error(
			`Response parsing failed: ${error instanceof Error ? error.message : 'Invalid format'}`
		);
	}
}
