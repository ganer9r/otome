/**
 * 셰프 캐릭터 이미지 & 대사 관리
 *
 * 이모션 타입:
 * - default: 기본 (홈 화면)
 * - happy: 기쁨 (성공, 새 발견)
 * - surprised: 놀람 (대성공, 레어)
 * - embarrassed: 당황 (실패)
 * - angry: 분노 (완전실패, 파산)
 * - proud: 뿌듯 (판매 성공)
 * - sad: 슬픔 (세금)
 */

export type ChefEmotion =
	| 'default'
	| 'happy'
	| 'surprised'
	| 'embarrassed'
	| 'angry'
	| 'proud'
	| 'sad';

// 이미지 경로 (나중에 표정별로 추가)
export const CHEF_IMAGES: Record<ChefEmotion, string> = {
	default: '/imgs/character/chef_default.png',
	happy: '/imgs/character/chef_default.png', // TODO: chef_happy.png
	surprised: '/imgs/character/chef_default.png', // TODO: chef_surprised.png
	embarrassed: '/imgs/character/chef_default.png', // TODO: chef_embarrassed.png
	angry: '/imgs/character/chef_default.png', // TODO: chef_angry.png
	proud: '/imgs/character/chef_default.png', // TODO: chef_proud.png
	sad: '/imgs/character/chef_default.png' // TODO: chef_sad.png
};

// 상황별 대사
export const CHEF_DIALOGUES: Record<ChefEmotion, string[]> = {
	default: [
		'오늘도 요리 한 판?',
		'재료는 준비됐어!',
		'뭘 만들어 볼까?',
		'손님들이 기다려!',
		'자, 시작해보자고!'
	],
	happy: ['오! 잘 만들었어!', '이 맛이야~', '완벽해!', '센스 있는데?', '역시 천재 요리사!'],
	surprised: [
		'헐! 대박!',
		'이건 전설이야!',
		'믿을 수가 없어!',
		'와... 진짜?!',
		'이런 요리는 처음이야!'
	],
	embarrassed: [
		'음... 이건 좀...',
		'뭔가 잘못됐어...',
		'다시 해볼까?',
		'괜찮아, 실패도 경험이야',
		'어... 일단 먹을 순 있어'
	],
	angry: ['이게 뭐야!', '아악! 망했어!', '누가 이렇게 해!', '진짜 최악이야...', '다 태워버렸잖아!'],
	proud: ['잘 팔렸어!', '돈이 들어온다~', '장사 잘 되네!', '역시 내 요리!', '손님이 좋아해!'],
	sad: ['세금이라니...', '돈이 나간다...', '국세청 무서워...', '열심히 벌었는데...', '아까워...']
};

// 랜덤 대사 가져오기
export function getRandomDialogue(emotion: ChefEmotion): string {
	const dialogues = CHEF_DIALOGUES[emotion];
	return dialogues[Math.floor(Math.random() * dialogues.length)];
}

// 이미지 경로 가져오기
export function getChefImage(emotion: ChefEmotion): string {
	return CHEF_IMAGES[emotion];
}
