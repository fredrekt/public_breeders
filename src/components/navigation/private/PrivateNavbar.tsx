import React, { useEffect, useState } from 'react';
import './PrivateNavbar.scss';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Typography, message } from 'antd';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../../../utils/authHelpers';
import { useUserContext } from '../../../context/UserContext';
import logoImg from '../../../assets/images/logo.png';
import { randomVector } from '../../../utils/randomVector';

const PrivateNavbar: React.FC = () => {
	const { user } = useUserContext();
	const [profileItems, setProfileItems] = useState<MenuProps['items']>([]);
	const navigate = useNavigate();

	const loadDynamicNavItems = () => {
		if (!user) return;
		let profileItemsDynamic: MenuProps['items'] = [
			{
				label: 'Profile',
				key: 'profile',
				icon: <i className="ri-settings-2-line"></i>,
				onClick: () => navigate(`/profile`)
			}
		];

		if (!user.isBuyer) {
			profileItemsDynamic.push({
				label: 'Dashboard',
				key: 'dashboard',
				icon: <i className="ri-dashboard-line"></i>,
				onClick: () => navigate(`/dashboard`)
			});
		}

		profileItemsDynamic.push({
			label: 'Logout',
			key: 'logout',
			icon: <i className="ri-logout-circle-line"></i>,
			onClick: () => logout()
		});
		setProfileItems(profileItemsDynamic);
	};

	useEffect(() => {
		loadDynamicNavItems();
		// eslint-disable-next-line
	}, [user]);

	const logout = () => {
		removeToken();
		message.success('Successfully logged out.');
		navigate('/login');
	};

	const renderNavigationItems = () => {
		if (!user) return;
		return (
			<div className="navCenter">
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/"
				>
					<i className={`ri-home-5-line ri-xl`}></i>
					<b>Home</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/inbox"
				>
					<i className={`ri-question-answer-line ri-xl`}></i>
					<b>Messages</b>
				</NavLink>
				{user.isBuyer && <NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/favorites"
				>
					<i className={`ri-heart-2-line ri-xl`}></i>
					<b>Favorites</b>
				</NavLink>}
				{!user.isBuyer && <NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/dashboard"
				>
					<i className={`ri-home-5-line ri-xl`}></i>
					<b>Dashboard</b>
				</NavLink>}
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/orders"
				>
					<i className={`ri-shopping-cart-2-line ri-xl`}></i>
					<b>Orders</b>
				</NavLink>
			</div>
		)
	}
 
	return (
		<div className="privateNavigation">
			<div className="navLogo">
				<Link to="/">
					<img className="navLogoImg" src={logoImg} alt="site logo" />
				</Link>
			</div>
			{renderNavigationItems()}
			{getToken() !== '' && user && <div className="navProfile">
				<Dropdown placement="bottomRight" arrow menu={{ items: profileItems }} trigger={['click']}>
					<span className="navProfileCta">
						<Avatar src={user.avatar ? user.avatar.url : require(`../../../assets/images/vectors/${randomVector}.png`)} />
						<Typography.Text>{user.firstName} {user.lastName}</Typography.Text>
					</span>
				</Dropdown>
			</div>}
		</div>
	);
};

export default PrivateNavbar;
