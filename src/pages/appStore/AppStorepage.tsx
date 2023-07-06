import React from 'react';
import './AppStorepage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Result } from 'antd';

const AppStorepage: React.FC = () => {
	return (
		<PublicLayout className="appStorePage absolute-centered" navbar>
			<Result status="404" title="In Progress" subTitle="You will be able to scan a QR or provided a link for our mobile app." />
		</PublicLayout>
	);
};

export default AppStorepage;
