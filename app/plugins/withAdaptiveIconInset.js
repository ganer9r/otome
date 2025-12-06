const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const INSET_DRAWABLE = `<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@mipmap/ic_launcher_foreground"
    android:insetLeft="16%"
    android:insetTop="16%"
    android:insetRight="16%"
    android:insetBottom="16%" />
`;

const ADAPTIVE_ICON = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/iconBackground"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground_inset"/>
</adaptive-icon>
`;

function withAdaptiveIconInset(config) {
	return withDangerousMod(config, [
		'android',
		async (config) => {
			const resPath = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res');

			// drawable 폴더에 inset xml 생성
			const drawablePath = path.join(resPath, 'drawable');
			const insetFile = path.join(drawablePath, 'ic_launcher_foreground_inset.xml');
			fs.writeFileSync(insetFile, INSET_DRAWABLE);

			// mipmap-anydpi-v26 폴더의 adaptive icon 수정
			const mipmapPath = path.join(resPath, 'mipmap-anydpi-v26');
			fs.writeFileSync(path.join(mipmapPath, 'ic_launcher.xml'), ADAPTIVE_ICON);
			fs.writeFileSync(path.join(mipmapPath, 'ic_launcher_round.xml'), ADAPTIVE_ICON);

			return config;
		}
	]);
}

module.exports = withAdaptiveIconInset;
