import React from 'react';
import './NotificationView.scss';
import { Card, Result } from 'antd';

const NotificationView: React.FC = () => {
	return (
		<Card>
			<Result status="404" title="404" subTitle="Sorry, this is still in progress" />
		</Card>
	);
};

export default NotificationView;
