import { Typography } from 'antd';
import React from 'react';
import PublicLayout from '../../layouts/public/PublicLayout';
import missingImg from '../../assets/images/missing.png';
import './MissingPage.scss'

const MissingPage: React.FC = () => {
	return (
		<PublicLayout navbar className="missingPage">
			<div className="missingContent">
				<img src={missingImg} alt="404" className="missingImg" />
				<Typography.Title className='missingHeaderTxt' level={4}>
					404
				</Typography.Title>
				<Typography.Paragraph className='missingSubTxt'>
				Sorry, this is still in progress. Content is still populating.
				</Typography.Paragraph>
			</div>
		</PublicLayout>
	);
};

export default MissingPage;
