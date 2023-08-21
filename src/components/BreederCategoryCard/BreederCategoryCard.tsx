import React from 'react';
import './BreederCategoryCard.scss';
import { Card, Typography } from 'antd';

interface BreederCategoryCardProps {
	id: number;
	selectedCategoryId: number;
	name: string;
	icon: string;
	onClick: (categoryId: number) => void;
}

const BreederCategoryCard: React.FC<BreederCategoryCardProps> = ({ id, name, icon, onClick, selectedCategoryId }) => {
	return (
		<Card
			onClick={() => onClick(id)}
			className={`breederCategoryCard ${selectedCategoryId === id ? 'selected' : ''}`}
		>
			<div className="categoryIconContainer">
				<i className={`${icon} ri-lg`}></i>
			</div>
			<Typography.Title className="breederCategoryName" level={5}>
				{name}
			</Typography.Title>
		</Card>
	);
};

export default BreederCategoryCard;
