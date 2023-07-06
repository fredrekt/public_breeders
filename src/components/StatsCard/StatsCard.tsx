import { Card, Statistic } from 'antd';
import React from 'react';
import './StatsCard.scss';

interface StatsCardProps {
	title: string;
	count: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, count }) => {
	return (
		<Card className="statCard" bordered={false}>
			<Statistic title={title} value={count} />
		</Card>
	);
};

export default StatsCard;
