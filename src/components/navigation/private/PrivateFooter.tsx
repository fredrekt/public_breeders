import { Typography } from 'antd';
import React from 'react';
import './PrivateFooter.scss';

const PrivateFooter: React.FC = () => {
	return (
		<footer className="privateFooter">
			<Typography.Paragraph className="footerCopyrightTxt">Made with ❤️ by &nbsp;<b>Studio Lore</b></Typography.Paragraph>
		</footer>
	);
};

export default PrivateFooter;
