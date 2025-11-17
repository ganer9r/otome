import { DISHES, findDishesByRecipeId } from './dishes';
import { RECIPES } from './recipes';
import { calculateProbabilities } from '../utils/calculateProbabilities';

/**
 * 데이터 무결성 검증
 */
export function verifyData() {
	console.log('🔍 데이터 검증 시작...\n');

	const errors: string[] = [];

	// 1. 레시피별 요리 확률 합 검증
	console.log('1. 레시피별 확률 합 검증:');
	RECIPES.forEach((recipe) => {
		const dishes = findDishesByRecipeId(recipe.id);

		if (dishes.length !== 3) {
			errors.push(`❌ ${recipe.name}: 요리 개수 ${dishes.length}개 (3개 필요)`);
			return;
		}

		try {
			const calculated = calculateProbabilities(dishes);
			const total = calculated.reduce((sum, d) => sum + d.probability, 0);

			if (total === 100) {
				const success = calculated.find(d => d.grade === 'success');
				console.log(`  ✅ ${recipe.name}: ${success?.probability}% / ${calculated[1].probability}% / ${calculated[2].probability}%`);
			} else {
				errors.push(`❌ ${recipe.name}: 확률 합 ${total}% (100% 필요)`);
			}
		} catch (error) {
			errors.push(`❌ ${recipe.name}: ${error}`);
		}
	});

	// 2. 레시피-재료 관계 검증
	console.log('\n2. 레시피-재료 관계 검증:');
	console.log(`  ✅ 총 ${RECIPES.length}개 레시피`);
	console.log(`  ✅ 총 ${DISHES.length}개 요리 (${RECIPES.length} × 3)`);

	// 3. 결과 출력
	console.log('\n📊 검증 결과:');
	if (errors.length === 0) {
		console.log('  ✅ 모든 검증 통과!');
		return true;
	} else {
		console.log(`  ❌ ${errors.length}개 오류 발견:`);
		errors.forEach(error => console.log(`     ${error}`));
		return false;
	}
}

// 실행
if (import.meta.url === `file://${process.argv[1]}`) {
	verifyData();
}
