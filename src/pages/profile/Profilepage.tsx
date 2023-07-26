import React, { useEffect, useState } from 'react';
import './Profilepage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Badge, Col, Menu, Row, message } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import SettingsView from '../../views/profile/SettingsView';
import HelpView from '../../views/profile/HelpView';
import NotificationView from '../../views/profile/NotificationView';
import OrdersView from '../../views/profile/OrdersView';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/authHelpers';
import PrivacyPolicyView from '../../views/profile/PrivacyPolicyView';
import TermsOfServiceView from '../../views/profile/TermsOfServiceView';
import axios from 'axios';
import { API_BASE_URL, API_URL } from '../../utils/constant';
import { Model } from '../../models/model';
import { useUserContext } from '../../context/UserContext';
import io from 'socket.io-client';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key?: React.Key | null,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label
	} as MenuItem;
}

const socket = io(API_BASE_URL); //Connecting to Socket.io backend

const Profilepage: React.FC = () => {
	const { user } = useUserContext();
	const [selectedView, setSelectedView] = useState<number>(0);
	const [notificationCount, setNotificationCount] = useState<number>(0);
	const [listOfNotifications, setListOfNotifications] = useState<Model.Notification[]>([]);
	const [forceUpdate, setForceUpdate] = useState<boolean>(false);
	const navigate = useNavigate();

	const logout = async () => {
		try {
			removeToken();
			navigate(`/login`);
			message.success(`Successfully logout.`);
		} catch (error) {
			message.error(`Something wen't wrong in logging out.`);
		}
	};

	const items: MenuItem[] = [
		getItem('Settings', 0, <i className="ri-settings-2-line"></i>),
		getItem(<>Notification <Badge className='notificationCountBadge' count={notificationCount} /></>, 1, <i className="ri-notification-3-line"></i>),
		getItem('My Orders', 2, <i className="ri-file-list-line"></i>),
		getItem('Help', 3, <i className="ri-question-line"></i>),
		getItem('Privacy Policy', 4, <i className="ri-shield-check-line"></i>),
		getItem('Terms of Service', 5, <i className="ri-pages-line"></i>),
		getItem('Logout', 6, <i className="ri-logout-box-line"></i>)
	];

	const listOfViews = [
		<SettingsView />,
		<NotificationView
			listOfNotifications={listOfNotifications}
			setListOfNotifications={(value: any) => setListOfNotifications(value)}
			setCount={(count: number) => setNotificationCount(notificationCount - count)}
			onForceCb={() => setForceUpdate(!forceUpdate)}
		/>,
		<OrdersView />,
		<HelpView />,
		<PrivacyPolicyView />,
		<TermsOfServiceView />
	];

	const loadNotification = async () => {
		if (!user) return;
		try {
			const res = (await axios.get(`${API_URL}/notifications`)).data;
			setListOfNotifications(res);
			setNotificationCount(res.filter((data: Model.Notification) => !data.isRead).length);
		} catch (error) {
			message.error(`Something wen't wrong in getting notifications.`);
		}
	};

	const loadSocketNotifications = async () => {
		socket.on('newNotification', async (data: any, error) => {
			setListOfNotifications((prev: any) => {
				const isExisting = prev && prev.some((obj: any) => parseInt(obj.id) === parseInt(data.id));
				if (!isExisting) {
					const updatedMessages = prev ? [...prev, data] : [data];
					if (!data.isRead) {
						setNotificationCount(prev.filter((data: Model.Notification) => !data.isRead).length + 1);
					}
					return updatedMessages;
				}
				return prev;
			});
		});

		return () => {
			socket.disconnect();
		};
	};

	useEffect(() => {
		loadSocketNotifications();
	}, []);

	useEffect(() => {
		loadNotification()
		// eslint-disable-next-line
	}, [forceUpdate, user]);

	return (
		<PrivateLayout className="profilePage customLayoutWidth">
			<PageTitle title="Profile" />
			<Row className="profileViewRow" gutter={[24, 24]}>
				<Col lg={4}>
					<Menu
						style={{ width: 256 }}
						onSelect={(e: any) => {
							if (e.key === '6') {
								logout();
								return;
							} else if (e.key === '2') {
								navigate(`/orders`);
							} else if (e.key === '4') {
								navigate(`/privacy-policy`);
							} else if (e.key === '5') {
								navigate(`/terms-and-conditions`);
							} else {
								setSelectedView(e.key);
							}
						}}
						defaultSelectedKeys={[selectedView.toString()]}
						mode={'vertical'}
						theme={'light'}
						items={items}
					/>
				</Col>
				<Col lg={20}>{listOfViews[selectedView]}</Col>
			</Row>
		</PrivateLayout>
	);
};

export default Profilepage;
