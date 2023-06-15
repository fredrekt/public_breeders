import React from 'react';
import './PrivateNavbar.scss';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

const PrivateNavbar: React.FC = () => {
	const navigate = useNavigate();
	const [current, setCurrent] = useLocalStorage<string>('navigationItem', '');

	const items: MenuProps['items'] = [
		{
			label: 'Home',
			key: '',
			icon: <i className="ri-home-3-line"></i>
		},
		{
			label: 'Public Pages',
			key: 'public',
			icon: <i className="ri-list-check"></i>,
			children: [
				{
					label: 'Login',
					key: 'login',
					icon: <i className="ri-login-box-line"></i>
				},
				{
					label: 'Register',
					key: 'register',
					icon: <i className="ri-add-circle-line"></i>
				},
				{
					label: 'Forgot Password',
					key: 'forgot-password',
					icon: <i className="ri-question-line"></i>
				}
			]
		},
		{
			label: 'Animal',
			key: 'animal/12345',
			icon: <i className="ri-evernote-fill"></i>
		},
		{
			label: 'Breeder',
			key: 'breeder/12345',
			icon: <i className="ri-gitlab-line"></i>
		},
		{
			label: 'Inbox',
			key: 'inbox',
			icon: <i className="ri-message-2-line"></i>
		},
		{
			label: 'Favorites',
			key: 'favorites',
			icon: <i className="ri-heart-2-line"></i>
		},
		{
			label: 'Orders',
			key: 'orders',
			icon: <i className="ri-file-list-2-line"></i>
		},
		{
			label: 'Profile',
			key: 'profile',
			icon: <i className="ri-settings-2-line"></i>
		}
	];

	const onClick: MenuProps['onClick'] = (e) => {
		console.log('click ', e);
		navigate(`/${e.key}`);
		setCurrent(e.key);
	};

	return (
		<Menu
			className="privateNavigation"
			onClick={onClick}
			selectedKeys={[current]}
			mode="horizontal"
			items={items}
		/>
	);
};

export default PrivateNavbar;
