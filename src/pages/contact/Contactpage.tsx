import React from 'react';
import './Contactpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Result } from 'antd';

const Contactpage: React.FC = () => {
	return (
		<PublicLayout className="contactPage  absolute-centered" navbar>
			<Result status="404" title="404" subTitle="Sorry, this is still in progress. Forms is still generating." />
		</PublicLayout>
	);
};

export default Contactpage;
