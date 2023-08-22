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
						<Link className="mobileMenuItem" to="/">
							Home
						</Link>
                        <Link className="mobileMenuItem" to="/inbox">
							Messages
						</Link>
                        <Link className="mobileMenuItem" to="/favorites">
							Favorites
						</Link>
                        <Link className="mobileMenuItem" to="/orders">
							Orders
						</Link>
						<Link className="mobileMenuItem" to="/profile">
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
						<Link className="mobileMenuItem" to="/">
							Pups for sale
						</Link>
						<Link className="mobileMenuItem" to="/">
							Upcoming Litters
						</Link>
						<Link className="mobileMenuItem" to="/">
							Stud Profiles
						</Link>
						<Link className="mobileMenuItem" to="/login">
							Login
						</Link>
						<Link className="mobileMenuItem cta" to="/register">
							Sign Up
						</Link>
					</>
				)}
			</div>
		</Drawer>
	);
};

export default MobileMenuDrawer;
