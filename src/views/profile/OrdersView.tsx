import React from 'react';
import './OrdersView.scss';
import { Card, Result } from 'antd';

const OrdersView: React.FC = () => {
	return (
		<Card>
			<Result status="404" title="404" subTitle="Sorry, this is still in progress" />
		</Card>
	);
};

export default OrdersView;
