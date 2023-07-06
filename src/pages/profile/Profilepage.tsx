import React, { useState } from 'react';
import './Profilepage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Col, Menu, Row, message } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import SettingsView from '../../views/profile/SettingsView';
import HelpView from '../../views/profile/HelpView';
import NotificationView from '../../views/profile/NotificationView';
import OrdersView from '../../views/profile/OrdersView';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/authHelpers';
import PrivacyPolicyView from '../../views/profile/PrivacyPolicyView';
import TermsOfServiceView from '../../views/profile/TermsOfServiceView';

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

const Profilepage: React.FC = () => {
	const [selectedView, setSelectedView] = useState<number>(0);
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
		getItem('Notification', 1, <i className="ri-notification-3-line"></i>),
		getItem('My Orders', 2, <i className="ri-file-list-line"></i>),
		getItem('Help', 3, <i className="ri-question-line"></i>),
		getItem('Privacy Policy', 4, <i className="ri-shield-check-line"></i>),
		getItem('Terms of Service', 5, <i className="ri-pages-line"></i>),
		getItem('Logout', 6, <i className="ri-logout-box-line"></i>)
	];

	const listOfViews = [
		<SettingsView />,
		<NotificationView />,
		<OrdersView />,
		<HelpView />,
		<PrivacyPolicyView />,
		<TermsOfServiceView />
	];

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
