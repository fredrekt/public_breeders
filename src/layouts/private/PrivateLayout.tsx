import React, { useEffect } from 'react';
import './PrivateLayout.scss';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import PrivateNavbar from '../../components/navigation/private/PrivateNavbar';
import { useLocation } from 'react-router-dom';
import { FloatButton } from 'antd';
import PrivateFooter from '../../components/navigation/private/PrivateFooter';
// import CartDrawer from '../../drawers/Cart/CartDrawer';
import ProtectedRoute from '../../utils/ProtectedRoute';
const Fade = require('react-reveal/Fade');

interface PrivateLayoutProps {
	className: string;
	children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ className, children }) => {
	const { pathname } = useLocation();
	// const [openCartDrawer, setOpenCartDrawer] = useState<boolean>(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<ProtectedRoute>
			<Layout className="privateLayoutContainer">
				<Header style={{ backgroundColor: `#3c3a3b` }}>
					<PrivateNavbar />
				</Header>
				<Content className={`privateLayoutContentContainer ${className}`}>
					<Fade>{children}</Fade>
				</Content>
				<Footer className='mainFooter'>
					<PrivateFooter />
				</Footer>
				<FloatButton
					onClick={() => window.scrollTo(0, 0)}
					icon={<i className="ri-skip-up-line"></i>}
					type="primary"
					style={{ right: 50 }}
				/>
				{/* <FloatButton
					onClick={() => setOpenCartDrawer(true)}
					icon={<i className="ri-shopping-bag-2-line"></i>}
					type="primary"
					style={{ right: 50 }}
				/>
				<CartDrawer
					opened={openCartDrawer}
					onCancel={() => setOpenCartDrawer(false)}
					onForceCb={() => console.log('')}
				/> */}
			</Layout>
		</ProtectedRoute>
	);
};

export default PrivateLayout;
