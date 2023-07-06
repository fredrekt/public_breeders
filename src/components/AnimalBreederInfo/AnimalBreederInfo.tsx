import React from 'react';
import './AnimalBreederInfo.scss';
import { Avatar, Typography } from 'antd';
import { Link } from 'react-router-dom';

interface AnimalBreederInfoProps {
	breederId: number;
	name: string;
	avatarUrl: string;
	description: string;
	address: string;
	verified: boolean;
}

const AnimalBreederInfo: React.FC<AnimalBreederInfoProps> = ({
	breederId,
	name,
	avatarUrl,
	description,
	address,
	verified
}) => {
	return (
		<div className="animalBreederInfo">
			<Link to={`/breeder/${breederId}`} className="animalBreederDetails">
				<Avatar size={64} src={avatarUrl} shape={'circle'} />
				<div className="animalBreederInfoMeta">
					<div className="animalBreederName">
						<Typography.Title level={5} className="businessName">
							{name}
						</Typography.Title>
						<i className={`ri-checkbox-circle-${verified ? 'fill verified' : 'line unverified'} ri-1x`}></i>
					</div>
					<Typography.Paragraph className="businessDescription">{description}</Typography.Paragraph>
				</div>
			</Link>
			<div className="animalBreederLocation">
				<i className="ri-map-pin-line ri-2x"></i>
				<Typography.Paragraph className="location">{address}</Typography.Paragraph>
			</div>
		</div>
	);
};

export default AnimalBreederInfo;
