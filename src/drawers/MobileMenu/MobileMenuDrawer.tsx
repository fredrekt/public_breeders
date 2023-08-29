import React from 'react';
import './MobileMenuDrawer.scss';
import { DrawerModel } from '../../models/DrawerModel';
import { Drawer, message } from 'antd';
import { Link } from 'react-router-dom';
import { getToken, removeToken } from '../../utils/authHelpers';

interface MobileMenuDrawerProps extends DrawerModel {
	auth?: boolean;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ opened, onCancel, onForceCb, auth }) => {
	return (
		<Drawer
			height={`100%`}
			width={`100%`}
			className="mobileMenuDrawer"
			placement="bottom"
			open={opened}
			onClose={onCancel}
		>
			<div className="mobileMenuNavItems">
				{getToken() ? (
					<>
						<Link onClick={onCancel} className="mobileMenuItem" to="/">
							Home
						</Link>
                        <Link onClick={onCancel} className="mobileMenuItem" to="/inbox">
							Messages
						</Link>
                        <Link onClick={onCancel} className="mobileMenuItem" to="/favorites">
							Favorites
						</Link>
                        <Link onClick={onCancel} className="mobileMenuItem" to="/orders">
							Orders
						</Link>
						<Link onClick={onCancel} className="mobileMenuItem" to="/profile">
							Profile
						</Link>
                        <Link className="mobileMenuItem cta" onClick={() => {
							removeToken();
							message.success('Successfully logged out.');
						}} to="/login">
							Sign Out
						</Link>
					</>
				) : (
					<>
						<Link onClick={onCancel} className="mobileMenuItem" to="/?categoryId=2">
							Pups for sale
						</Link>
						<Link onClick={onCancel} className="mobileMenuItem" to="/?categoryId=4">
							Upcoming Litters
						</Link>
						<Link onClick={onCancel} className="mobileMenuItem" to="/?categoryId=1">
							Stud Profiles
						</Link>
						<Link onClick={onCancel} className="mobileMenuItem" to="/login">
							Login
						</Link>
						<Link onClick={onCancel} className="mobileMenuItem cta" to="/register">
							Sign Up
						</Link>
					</>
				)}
			</div>
		</Drawer>
	);
};

export default MobileMenuDrawer;
