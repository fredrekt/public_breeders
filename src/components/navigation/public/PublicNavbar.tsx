import React, { useState } from 'react';
import './PublicNavbar.scss';
import { Link, NavLink } from 'react-router-dom';
import MobileMenuDrawer from '../../../drawers/MobileMenu/MobileMenuDrawer';
// import logoImg from '../../../assets/images/logo.png';

const PublicNavbar: React.FC = () => {
	const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
	return (
		<div className="publicNavbar">
			<div className="publicNavLogo">
				<Link to="/">
					MY BREEDERS STORE
					{/* <img className="publicNavLogoImg" src={logoImg} alt="site logo" /> */}
				</Link>
			</div>
			<div className="publicNavCenter">
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'navLink' : 'navLink')}
					to="/?categoryId=2"
				>
					<b>Pups for sale</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'navLink' : 'navLink')}
					to="/?categoryId=4"
				>
					<b>Upcoming Litters</b>
				</NavLink>
				<NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'navLink' : 'navLink')}
					to="/?categoryId=1"
				>
					<b>Stud Profiles</b>
				</NavLink>
				{/* <NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/demo"
				>
					<i className={`ri-play-circle-line ri-xl`}></i>
					<b>Demo</b>
				</NavLink> */}
				{/* <NavLink
					className={({ isActive }: { isActive: boolean }) => (isActive ? 'selected navLink' : 'navLink')}
					to="/mobile"
				>
					<i className={`ri-google-play-line ri-xl`}></i>
					<b>Mobile Application</b>
				</NavLink> */}
			</div>
			<div className="publicNavProfile">
				<Link className="loginCta" to="/login">
					Login
				</Link>
				<Link className='signUpCta' to="/register">
					Sign up
				</Link>
			</div>
			<div onClick={() => setOpenMobileMenu(true)} className="publicMobileNavItem">
				<i className="ri-menu-line ri-2x"></i>
			</div>
			<MobileMenuDrawer
				opened={openMobileMenu}
				onCancel={() => setOpenMobileMenu(false)}
				onForceCb={() => console.log('')}
			/>
		</div>
	);
};

export default PublicNavbar;
