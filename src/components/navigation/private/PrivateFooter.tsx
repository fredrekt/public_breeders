import { Col, Row } from 'antd';
import React from 'react';
import './PrivateFooter.scss';
import { Link } from 'react-router-dom';
import footerLogo from '../../../assets/images/footer_logo.png';

const PrivateFooter: React.FC = () => {
	return (
		<footer className="privateFooter">
			<Row align={'middle'} className="privateFooterRow">
				<Col lg={6}>
					<Link to="/">
						<img className="footerLogo" src={footerLogo} alt="footer logo" />
					</Link>
				</Col>
				<Col className='footerLinks' lg={4}>
					<b>Explore</b>
					<ul>
						<li><Link to="/">Pups for sale</Link></li>
						<li><Link to="/">Upcoming Litters</Link></li>
						<li><Link to="/">Stud Profiles</Link></li>
					</ul>
				</Col>
				<Col className='footerLinks' lg={4}>
					<b>Legal</b>
					<ul>
						<li><Link to="/terms-and-conditions">Terms of service</Link></li>
						<li><Link to="/privacy-policy">Privacy policy</Link></li>
						<li><Link to="/terms-and-conditions">Terms of use</Link></li>
					</ul>
				</Col>
				<Col className='footerLinks' lg={10}>
					<b>Account</b>
					<ul>
						<li><Link to="/profile">Profile</Link></li>
						<li><Link to="/profile">Settings</Link></li>
						<li><Link to="/orders">Orders</Link></li>
					</ul>
				</Col>
			</Row>
		</footer>
	);
};

export default PrivateFooter;
