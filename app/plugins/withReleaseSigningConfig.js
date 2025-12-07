const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Release 서명 설정을 build.gradle에 추가하는 플러그인
 */
function withReleaseSigningConfig(config) {
	return withAppBuildGradle(config, (config) => {
		let buildGradle = config.modResults.contents;

		// 이미 release signingConfig가 정의되어 있으면 스킵
		if (buildGradle.includes("storeFile file('../../cooking-release.keystore')")) {
			return config;
		}

		// 1. signingConfigs에 release 추가 (debug 블록 뒤에)
		buildGradle = buildGradle.replace(
			/(signingConfigs\s*\{[\s\S]*?debug\s*\{[\s\S]*?keyPassword\s+'android'\s*\})/,
			`$1
        release {
            storeFile file('../../cooking-release.keystore')
            storePassword System.getenv('KEYSTORE_PASSWORD') ?: ''
            keyAlias 'cook'
            keyPassword System.getenv('KEY_PASSWORD') ?: ''
        }`
		);

		// 2. buildTypes의 release에서 signingConfig를 signingConfigs.release로 변경
		buildGradle = buildGradle.replace(
			/(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
			'$1signingConfig signingConfigs.release'
		);

		config.modResults.contents = buildGradle;
		return config;
	});
}

module.exports = withReleaseSigningConfig;
