import * as Haptics from 'expo-haptics';

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export async function handleHaptic(style: HapticStyle = 'medium') {
	switch (style) {
		case 'light':
			await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			break;
		case 'medium':
			await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			break;
		case 'heavy':
			await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
			break;
		case 'success':
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			break;
		case 'warning':
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			break;
		case 'error':
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			break;
		default:
			await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	}
}
