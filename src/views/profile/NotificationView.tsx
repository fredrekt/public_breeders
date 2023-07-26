import React from 'react';
import './NotificationView.scss';
import { Card, List, message } from 'antd';
import { Model } from '../../models/model';
import axios from 'axios';
import { API_URL } from '../../utils/constant';

interface NotificationViewProps {
	listOfNotifications: Model.Notification[];
	setListOfNotifications: (value: any) => void;
	setCount: (count: number) => void;
	onForceCb: () => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ listOfNotifications, setListOfNotifications, setCount, onForceCb }) => {

	const onRead = async (notification: Model.Notification) => {
		if (!notification) return;
		try {
			const update = await axios.put(`${API_URL}/notifications/${notification.id}`, {
				data: {
					isRead: true
				}
			});
			if (update) {
				message.success(`Notification marked as read.`);
				setCount(1);
				onForceCb();
			}
		} catch (error) {
			message.error(`Something wen't wrong in marking notification as read.`);
		}
	}

	return (
		<Card className="notificationCard">
			<List
				itemLayout="horizontal"
				dataSource={listOfNotifications}
				renderItem={(item, index) => (
					<List.Item actions={!item.isRead ? [<i onClick={() => onRead(item)} className="ri-eye-line"></i>] : []} className={`notificationItem ${item.isRead ? 'read' : ''}`}>
						<List.Item.Meta
							avatar={<i className="ri-notification-3-line"></i>}
							title={item.type}
							description={item.message}
						/>
					</List.Item>
				)}
			/>
		</Card>
	);
};

export default NotificationView;
