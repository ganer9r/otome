/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { supabase } from '$lib/supabase/supabase.server';
import { addCharacter } from '$lib/domain/character/usecase.server';
import {
	generateAndSaveChapters,
	saveChapters,
	getActiveChapters
} from './usecase.server';
import type { ChapterItem, SaveChaptersParams } from './types';

describe('Chapter usecase TDD 테스트', () => {
	let testUid: string;
	let testCharacterId: string;
	let testChapterIds: string[] = [];

	beforeEach(async () => {
		// 테스트용 UUID 및 캐릭터 생성
		testUid = randomUUID();

		// 테스트용 캐릭터 생성
		const character = await addCharacter(testUid, {
			name: '테스트 캐릭터',
			info: '로맨스 소설 주인공',
			settings: '현대 도시 배경',
			introduction: '첫 만남의 순간',
			options: {
				chapter_guidelines: '30개 챕터로 관계 발전 표현',
				player_info: '평범한 회사원'
			}
		});
		testCharacterId = character.id;
		testChapterIds = [];
	});

	afterEach(async () => {
		// 테스트 데이터 정리
		if (testChapterIds.length > 0) {
			await supabase.from('chapters').delete().in('id', testChapterIds);
		}
		if (testCharacterId) {
			await supabase.from('characters').delete().eq('id', testCharacterId);
		}
	});

	describe('saveChapters(params)', () => {
		it('챕터 데이터를 직접 저장할 수 있어야 한다', async () => {
			// Given - 30개 챕터 데이터
			const chaptersData: ChapterItem[] = Array.from({ length: 30 }, (_, i) => ({
				order: i + 1,
				type: i % 2 === 0 ? 'meet' : 'chat',
				title: `챕터 ${i + 1}`,
				description: `챕터 ${i + 1} 설명`,
				content: `챕터 ${i + 1} 내용`
			})) as ChapterItem[];

			const params: SaveChaptersParams = {
				uid: testUid,
				characterId: testCharacterId,
				prompt: '로맨스 스토리 생성',
				data: chaptersData,
				model: 'google-ai-studio/gemini-2.5-flash'
			};

			// When - 챕터 저장
			const saved = await saveChapters(params);
			testChapterIds.push(saved.id);

			// Then - 저장 확인
			expect(saved.id).toBeDefined();
			expect(saved.uid).toBe(testUid);
			expect(saved.character_id).toBe(testCharacterId);
			expect(saved.prompt).toBe('로맨스 스토리 생성');
			expect(saved.model).toBe('google-ai-studio/gemini-2.5-flash');
			expect(Array.isArray(saved.data)).toBe(true);
			expect(saved.data).toHaveLength(30);
		});

		it('저장된 챕터 데이터가 올바른 구조여야 한다', async () => {
			// Given - 챕터 데이터
			const chaptersData: ChapterItem[] = [
				{
					order: 1,
					type: 'meet',
					title: '첫 만남',
					description: '우연히 마주친 순간',
					content: '비 오는 날 카페에서...'
				},
				{
					order: 2,
					type: 'chat',
					title: '첫 메시지',
					description: '떨리는 손끝으로 보낸 메시지',
					content: '안녕하세요...'
				}
			];

			// 나머지 28개 챕터 추가 (총 30개)
			for (let i = 3; i <= 30; i++) {
				chaptersData.push({
					order: i,
					type: i % 2 === 0 ? 'chat' : 'meet',
					title: `챕터 ${i}`,
					description: `설명 ${i}`,
					content: `내용 ${i}`
				});
			}

			const params: SaveChaptersParams = {
				uid: testUid,
				characterId: testCharacterId,
				prompt: '테스트',
				data: chaptersData,
				model: 'test-model'
			};

			// When - 챕터 저장
			const saved = await saveChapters(params);
			testChapterIds.push(saved.id);

			// Then - 첫 번째 챕터 구조 확인
			const firstChapter = (saved.data as unknown as ChapterItem[])[0];
			expect(firstChapter.order).toBe(1);
			expect(firstChapter.type).toBe('meet');
			expect(firstChapter.title).toBe('첫 만남');
			expect(firstChapter.description).toBe('우연히 마주친 순간');
			expect(firstChapter.content).toBe('비 오는 날 카페에서...');

			// 두 번째 챕터 구조 확인
			const secondChapter = (saved.data as unknown as ChapterItem[])[1];
			expect(secondChapter.order).toBe(2);
			expect(secondChapter.type).toBe('chat');
		});
	});

	describe('getActiveChapters(uid, characterId)', () => {
		it('캐릭터의 활성 챕터를 조회할 수 있어야 한다', async () => {
			// Given - 챕터 저장
			const chaptersData: ChapterItem[] = Array.from({ length: 30 }, (_, i) => ({
				order: i + 1,
				type: i % 2 === 0 ? 'meet' : 'chat',
				title: `챕터 ${i + 1}`,
				description: `설명 ${i + 1}`,
				content: `내용 ${i + 1}`
			})) as ChapterItem[];

			const saved = await saveChapters({
				uid: testUid,
				characterId: testCharacterId,
				prompt: '테스트',
				data: chaptersData,
				model: 'test-model'
			});
			testChapterIds.push(saved.id);

			// When - 활성 챕터 조회
			const active = await getActiveChapters(testUid, testCharacterId);

			// Then - 조회 확인
			expect(active).not.toBeNull();
			expect(active?.id).toBe(saved.id);
			expect(active?.character_id).toBe(testCharacterId);
			expect(active?.deleted_at).toBeNull();
		});

		it('챕터가 없으면 null을 반환해야 한다', async () => {
			// Given - 챕터가 없는 상태

			// When - 활성 챕터 조회
			const active = await getActiveChapters(testUid, testCharacterId);

			// Then - null 반환
			expect(active).toBeNull();
		});

		it('soft delete된 챕터는 조회되지 않아야 한다', async () => {
			// Given - 챕터 저장 후 soft delete
			const chaptersData: ChapterItem[] = Array.from({ length: 30 }, (_, i) => ({
				order: i + 1,
				type: i % 2 === 0 ? 'meet' : 'chat',
				title: `챕터 ${i + 1}`,
				description: `설명 ${i + 1}`,
				content: `내용 ${i + 1}`
			})) as ChapterItem[];

			const saved = await saveChapters({
				uid: testUid,
				characterId: testCharacterId,
				prompt: '테스트',
				data: chaptersData,
				model: 'test-model'
			});
			testChapterIds.push(saved.id);

			// soft delete 수행
			const now = new Date().toISOString();
			await supabase
				.from('chapters')
				.update({ deleted_at: now })
				.eq('id', saved.id);

			// When - 활성 챕터 조회
			const active = await getActiveChapters(testUid, testCharacterId);

			// Then - null 반환 (soft delete된 챕터는 제외)
			expect(active).toBeNull();
		});
	});

	describe('generateAndSaveChapters(uid, characterId, prompt) - 챕터 생성', () => {
		it('LLM을 통해 챕터를 생성하고 저장할 수 있어야 한다', async () => {
			// Given - 캐릭터 준비됨
			const prompt = '두 사람의 로맨스 스토리를 30개 챕터로 작성해주세요.';

			// When - 챕터 생성
			const chapters = await generateAndSaveChapters(testUid, testCharacterId, prompt);
			testChapterIds.push(chapters.id);

			// Then - 챕터 생성 확인
			expect(chapters.id).toBeDefined();
			expect(chapters.uid).toBe(testUid);
			expect(chapters.character_id).toBe(testCharacterId);
			expect(chapters.prompt).toBe(prompt);
			expect(chapters.model).toBeDefined();
			expect(Array.isArray(chapters.data)).toBe(true);
		}, 60000); // 60초 타임아웃

		it('생성된 챕터는 정확히 30개여야 한다', async () => {
			// Given - 캐릭터 준비됨
			const prompt = '30개 챕터로 이루어진 로맨스 스토리';

			// When - 챕터 생성
			const chapters = await generateAndSaveChapters(testUid, testCharacterId, prompt);
			testChapterIds.push(chapters.id);

			// Then - 30개 챕터 확인
			expect(chapters.data).toHaveLength(30);
		}, 60000); // 60초 타임아웃

		it('각 챕터는 필수 필드를 포함해야 한다', async () => {
			// Given - 캐릭터 준비됨
			const prompt = '로맨스 스토리 생성';

			// When - 챕터 생성
			const chapters = await generateAndSaveChapters(testUid, testCharacterId, prompt);
			testChapterIds.push(chapters.id);

			// Then - 각 챕터 구조 검증
			const chaptersData = chapters.data as unknown as ChapterItem[];
			chaptersData.forEach((chapter, index) => {
				expect(chapter.order).toBe(index + 1);
				expect(['meet', 'chat']).toContain(chapter.type);
				expect(chapter.title).toBeTruthy();
				expect(chapter.description).toBeTruthy();
				expect(chapter.content).toBeTruthy();
			});
		}, 60000); // 60초 타임아웃

		it('meet와 chat 타입이 적절히 분배되어야 한다', async () => {
			// Given - 캐릭터 준비됨
			const prompt = '로맨스 스토리 생성';

			// When - 챕터 생성
			const chapters = await generateAndSaveChapters(testUid, testCharacterId, prompt);
			testChapterIds.push(chapters.id);

			// Then - meet/chat 비율 확인 (13-17개 범위)
			const chaptersData = chapters.data as unknown as ChapterItem[];
			const meetCount = chaptersData.filter(c => c.type === 'meet').length;
			const chatCount = chaptersData.filter(c => c.type === 'chat').length;

			expect(meetCount).toBeGreaterThanOrEqual(13);
			expect(meetCount).toBeLessThanOrEqual(17);
			expect(chatCount).toBeGreaterThanOrEqual(13);
			expect(chatCount).toBeLessThanOrEqual(17);
			expect(meetCount + chatCount).toBe(30);
		}, 60000); // 60초 타임아웃
	});

	describe('generateAndSaveChapters(uid, characterId, prompt) - 재생성 (soft delete)', () => {
		it('재생성 시 기존 챕터가 soft delete 되어야 한다', async () => {
			// Given - 첫 번째 챕터 생성
			const chaptersData: ChapterItem[] = Array.from({ length: 30 }, (_, i) => ({
				order: i + 1,
				type: i % 2 === 0 ? 'meet' : 'chat',
				title: `첫번째 챕터 ${i + 1}`,
				description: `설명 ${i + 1}`,
				content: `내용 ${i + 1}`
			})) as ChapterItem[];

			const first = await saveChapters({
				uid: testUid,
				characterId: testCharacterId,
				prompt: '첫 번째 생성',
				data: chaptersData,
				model: 'test-model'
			});
			testChapterIds.push(first.id);

			// When - 재생성 (generateAndSaveChapters 호출)
			const second = await generateAndSaveChapters(
				testUid,
				testCharacterId,
				'재생성 요청'
			);
			testChapterIds.push(second.id);

			// Then - 첫 번째 챕터는 soft delete됨
			const { data: firstRecord } = await supabase
				.from('chapters')
				.select('*')
				.eq('id', first.id)
				.single();

			expect(firstRecord?.deleted_at).not.toBeNull();
			expect(new Date(firstRecord!.deleted_at as string)).toBeInstanceOf(Date);

			// 두 번째 챕터는 활성 상태
			expect(second.deleted_at).toBeNull();

			// getActiveChapters는 두 번째 챕터만 반환
			const active = await getActiveChapters(testUid, testCharacterId);
			expect(active?.id).toBe(second.id);
			expect(active?.prompt).toBe('재생성 요청');
		}, 60000); // 60초 타임아웃

		it('여러 번 재생성 시 모든 이전 챕터가 soft delete 되어야 한다', async () => {
			// Given - 첫 번째 생성
			const chaptersData: ChapterItem[] = Array.from({ length: 30 }, (_, i) => ({
				order: i + 1,
				type: i % 2 === 0 ? 'meet' : 'chat',
				title: `챕터 ${i + 1}`,
				description: `설명 ${i + 1}`,
				content: `내용 ${i + 1}`
			})) as ChapterItem[];

			const first = await saveChapters({
				uid: testUid,
				characterId: testCharacterId,
				prompt: '첫 번째',
				data: chaptersData,
				model: 'test-model'
			});
			testChapterIds.push(first.id);

			// When - 두 번째 생성
			const second = await generateAndSaveChapters(testUid, testCharacterId, '두 번째');
			testChapterIds.push(second.id);

			// 세 번째 생성
			const third = await generateAndSaveChapters(testUid, testCharacterId, '세 번째');
			testChapterIds.push(third.id);

			// Then - 첫 번째, 두 번째 모두 soft delete됨
			const { data: allChapters } = await supabase
				.from('chapters')
				.select('*')
				.eq('character_id', testCharacterId)
				.order('created_at', { ascending: true });

			expect(allChapters).toHaveLength(3);
			expect(allChapters?.[0].id).toBe(first.id);
			expect(allChapters?.[0].deleted_at).not.toBeNull();
			expect(allChapters?.[1].id).toBe(second.id);
			expect(allChapters?.[1].deleted_at).not.toBeNull();
			expect(allChapters?.[2].id).toBe(third.id);
			expect(allChapters?.[2].deleted_at).toBeNull();

			// getActiveChapters는 세 번째만 반환
			const active = await getActiveChapters(testUid, testCharacterId);
			expect(active?.id).toBe(third.id);
		}, 120000); // 120초 타임아웃 (2번 생성)
	});
});
