import { uuidv7 } from 'uuidv7';
import { supabase } from '$lib/supabase/supabase.server';
import type { Character, CreateCharacterDto, UpdateCharacterDto } from './types';

/**
 * 캐릭터 생성
 */
export async function addCharacter(uid: string, dto: CreateCharacterDto): Promise<Character> {
	// UUID v7 생성 (시간순 정렬 가능)
	const id = uuidv7();

	// 캐릭터 데이터 생성
	const { data, error } = await supabase
		.from('characters')
		.insert({
			id,
			uid,
			name: dto.name,
			info: dto.info || null,
			settings: dto.settings || null,
			introduction: dto.introduction || null,
			options: dto.options || {}
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create character: ${error.message}`);
	}

	return data;
}

/**
 * 사용자의 캐릭터 목록 조회 (생성일자 내림차순)
 */
export async function getCharacters(uid: string): Promise<Character[]> {
	const { data, error } = await supabase
		.from('characters')
		.select('*')
		.eq('uid', uid)
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch characters: ${error.message}`);
	}

	return data || [];
}

/**
 * 단일 캐릭터 조회 (UID 검증 포함)
 */
export async function getCharacter(uid: string, id: string): Promise<Character | null> {
	const { data, error } = await supabase
		.from('characters')
		.select('*')
		.eq('id', id)
		.eq('uid', uid)
		.maybeSingle();

	if (error) {
		throw new Error(`Failed to fetch character: ${error.message}`);
	}

	return data;
}

/**
 * 캐릭터 업데이트 (부분 업데이트, UID 검증)
 */
export async function updateCharacter(
	uid: string,
	id: string,
	dto: UpdateCharacterDto
): Promise<Character> {
	// 먼저 소유권 확인
	const existing = await getCharacter(uid, id);
	if (!existing) {
		throw new Error('Character not found or access denied');
	}

	// 업데이트할 데이터 준비
	const updateData: any = {
		updated_at: new Date().toISOString()
	};

	if (dto.name !== undefined) updateData.name = dto.name;
	if (dto.info !== undefined) updateData.info = dto.info;
	if (dto.settings !== undefined) updateData.settings = dto.settings;
	if (dto.introduction !== undefined) updateData.introduction = dto.introduction;
	if (dto.options !== undefined) updateData.options = dto.options;

	const { data, error } = await supabase
		.from('characters')
		.update(updateData)
		.eq('id', id)
		.eq('uid', uid)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update character: ${error.message}`);
	}

	return data;
}

/**
 * 캐릭터 삭제 (UID 검증)
 */
export async function deleteCharacter(uid: string, id: string): Promise<void> {
	// 먼저 소유권 확인
	const existing = await getCharacter(uid, id);
	if (!existing) {
		throw new Error('Character not found or access denied');
	}

	const { error } = await supabase.from('characters').delete().eq('id', id).eq('uid', uid);

	if (error) {
		throw new Error(`Failed to delete character: ${error.message}`);
	}
}
