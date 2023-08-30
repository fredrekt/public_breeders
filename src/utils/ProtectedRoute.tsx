import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from './authHelpers';
import { API_URL, BEARER } from './constant';
import { message } from 'antd';
import axios from 'axios';
import { AuthContext } from '../context/UserContext';
import { Api } from '../models/api';
import PaywallPopup from '../popups/PaywallPopup/PaywallPopup';

interface ProtectedRouteInterface {
	children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteInterface> = (props) => {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
	const authToken = getToken();
	const [userData, setUserData] = useState<Api.User.Res.LoggedInUser | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [openPaywall, setOpenPaywall] = useState<boolean>(false);
	const [forceUpdate, setForceUpdate] = useState<boolean>(false);

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

	const breederRestrictions = async () => {
		if (!authToken) return;
		if (!userData) return;
		if (!userData.isBuyer && userData.breeder && !userData.breeder.isVerified) {
			removeToken();
			return;
		}
		if (!userData.isBuyer && !userData.isSubscribed) {
			setOpenPaywall(true);
		}
		if (!userData.isBuyer && userData.isSubscribed && !userData.stripeAccountId && !userData.stripeAccountLink) {
			// redirect to breeder onboarding payout setup page
			navigate(`/breeder/onboarding`);
		}
	}

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

	useEffect(() => {
		breederRestrictions();
		// eslint-disable-next-line
	}, [userData, authToken, forceUpdate]);

	return isLoggedIn ? (
		<AuthContext.Provider value={{ user: userData, setUser: handleUser, isLoading }}>
			{props.children}
			<PaywallPopup opened={openPaywall} onCancel={() => setOpenPaywall(false)} onForceCb={() => setForceUpdate(!forceUpdate)} />
		</AuthContext.Provider>
	) : (
		<Navigate to="/login" replace />
	);
};

export default ProtectedRoute;
