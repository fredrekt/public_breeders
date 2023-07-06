import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from './authHelpers';
import { API_URL, BEARER } from './constant';
import { message } from 'antd';
import axios from 'axios';
import { AuthContext } from '../context/UserContext';
import { Api } from '../models/api';

interface ProtectedRouteInterface {
	children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteInterface> = (props) => {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
	const authToken = getToken();
	const [userData, setUserData] = useState<Api.User.Res.LoggedInUser | undefined>();
	const [isLoading, setIsLoading] = useState(false);

	const verifyUserToken = async (token: string) => {
		setIsLoading(true);
		try {
			const tokenString: string = `${BEARER} ${token}`
			const userAuth = await axios.get(`${API_URL}/users/me?populate=deep,3`, {
				headers: {
					Authorization: tokenString
				}
			});
			axios.defaults.headers.common['Authorization'] = tokenString;
			setUserData(userAuth.data);
		} catch (error) {
			removeToken();
			message.error('Unauthorized.');
			navigate('/login');
			return;
		} finally {
			setIsLoading(false);
			setIsLoggedIn(true);
		}
	};

	const checkUser = async () => {
		if (!authToken) {
			setIsLoggedIn(false);
		} else {
			verifyUserToken(authToken);
		}
	};

	const handleUser = (user: Api.User.Res.LoggedInUser) => {
		setUserData(user);
	};

	useEffect(() => {
		checkUser();
		// eslint-disable-next-line
	}, [authToken]);

	return isLoggedIn ? (
		<AuthContext.Provider value={{ user: userData, setUser: handleUser, isLoading }}>
			{props.children}
		</AuthContext.Provider>
	) : (
		<Navigate to="/login" replace />
	);
};

export default ProtectedRoute;
