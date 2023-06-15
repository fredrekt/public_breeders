import React from 'react';
import './HelpView.scss';
import { Card, Result } from 'antd';

const HelpView: React.FC = () => {
	return (
		<Card>
			<Result status="404" title="404" subTitle="Sorry, this is still in progress" />
		</Card>
	);
};

export default HelpView;
