import { createContext, useContext } from 'react';
import { Api } from '../models/api';

interface UserContext {
	user: Api.User.Res.LoggedInUser | undefined;
	isLoading: boolean;
	setUser: (user: Api.User.Res.LoggedInUser) => void;
}

export const AuthContext = createContext<UserContext>({
	user: undefined,
	isLoading: false,
	setUser: () => {}
});

export const useUserContext = () => useContext(AuthContext);
