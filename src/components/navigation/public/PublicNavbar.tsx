import React from 'react';
import './PublicNavbar.scss';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../../../assets/images/logo.png';
import { Button } from 'antd';

const PublicNavbar: React.FC = () => {
	return (
		<div className="publicNavbar">
			<div className="publicNavLogo">
				<Link to="/">
					<img className="publicNavLogoImg" src={logoImg} alt="site logo" />
				</Link>
			</div>
			<div className="publicNavCenter">
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/"
				>
					<i className={`ri-store-2-line ri-xl`}></i>
					<b>Marketplace</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/about"
				>
					<i className={`ri-information-line ri-xl`}></i>
					<b>About</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/contact"
				>
					<i className={`ri-contacts-book-2-line ri-xl`}></i>
					<b>Contact</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/demo"
				>
					<i className={`ri-play-circle-line ri-xl`}></i>
					<b>Demo</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/mobile"
				>
					<i className={`ri-google-play-line ri-xl`}></i>
					<b>Mobile Application</b>
				</NavLink>
			</div>
			<div className="publicNavProfile">
				<Link className="loginCta" to="/login">
					Login
				</Link>
				<Link to="/register">
					<Button className="signUpCta" type="primary">
						Sign Up
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default PublicNavbar;
