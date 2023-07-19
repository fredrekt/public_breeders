import React, { useEffect } from 'react';
import './PublicLayout.scss';
import { Avatar, Col, Layout, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import logoImg from '../../assets/images/logo.png';
import { useLocation } from 'react-router-dom';
import PublicNavbar from '../../components/navigation/public/PublicNavbar';
import PrivateFooter from '../../components/navigation/private/PrivateFooter';

interface PublicLayoutProps {
	className: string;
	children: React.ReactNode;
	navbar?: boolean;
	noFooter?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ className, children, navbar, noFooter }) => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<Layout className={`publicLayoutContainer`}>
			{navbar && <Header style={{ backgroundColor: `#3c3a3b`, zIndex: 1 }}>
				<PublicNavbar />
			</Header>}
			<Content className={`publicLayoutContentContainer ${className}`}>
				{!navbar && <Row align={'middle'} justify={'center'} className="publicLayoutLogo">
					<Col md={12} lg={6} xl={6} xxl={6}>
						<Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} src={logoImg} />
					</Col>
				</Row>}
				{children}
			</Content>
			{!noFooter && <Footer className='publicMainFooter'>
				<PrivateFooter />
			</Footer>}
		</Layout>
	);
};

export default PublicLayout;
