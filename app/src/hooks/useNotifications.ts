import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export function useNotifications() {
	useEffect(() => {
		const requestPermissions = async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status === 'granted') {
				console.log('Push notification permission granted');
			}
		};
		requestPermissions();
	}, []);
}
