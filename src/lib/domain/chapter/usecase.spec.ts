/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { supabase } from '$lib/supabase/supabase.server';
import { addCharacter } from '$lib/domain/character/usecase.server';
import { saveChapters, getActiveChapters } from './usecase.server';
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

});
