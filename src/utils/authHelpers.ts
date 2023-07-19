import { AUTH_TOKEN, SELECTED_CONVERSATION } from './constant';

export const getToken = (): string => {
	return localStorage.getItem(AUTH_TOKEN) || '';
};

export const setToken = (token: string) => {
	if (token) {
		localStorage.setItem(AUTH_TOKEN, token);
	}
};

export const removeToken = () => {
	localStorage.removeItem(AUTH_TOKEN);
	localStorage.removeItem(SELECTED_CONVERSATION);
};
