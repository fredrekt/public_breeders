import React from 'react';
import './Aboutpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Result } from 'antd';

const Aboutpage: React.FC = () => {
	return (
		<PublicLayout className="aboutPage  absolute-centered" navbar>
			<Result status="404" title="404" subTitle="Sorry, this is still in progress. Content is still populating." />
		</PublicLayout>
	);
};

export default Aboutpage;
