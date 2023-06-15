import React from 'react';
import './PublicLayout.scss';
import { Avatar, Col, Layout, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import logoImg from '../../assets/images/logo.png';

interface PublicLayoutProps {
	className: string;
	children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ className, children }) => {
	return (
		<Layout className={`publicLayoutContainer`}>
			<Content className={`publicLayoutContentContainer ${className}`}>
				<Row align={'middle'} justify={'center'} className="publicLayoutLogo">
					<Col md={12} lg={6} xl={6} xxl={6}>
						<Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} src={logoImg} />
					</Col>
				</Row>
				{children}
			</Content>
		</Layout>
	);
};

export default PublicLayout;
