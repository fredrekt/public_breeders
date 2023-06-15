import React from 'react';
import './BreederCategoryCard.scss';
import { Card, Typography } from 'antd';

interface BreederCategoryCardProps {
	id: number;
	name: string;
	icon: string;
}

const BreederCategoryCard: React.FC<BreederCategoryCardProps> = ({ id, name, icon }) => {
	return (
		<Card className="breederCategoryCard">
			<i className={`ri-${icon} ri-3x`}></i>
			<Typography.Title className="breederCategoryName" level={5}>
				{name}
			</Typography.Title>
		</Card>
	);
};

export default BreederCategoryCard;
