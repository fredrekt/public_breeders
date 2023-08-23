import React from 'react';
import { PopupModel } from '../../models/PopupModel';
import './RegisterWallPopup.scss';
import { Button, Modal, Typography } from 'antd';
import registerImg from '../../assets/images/register.png';
import { Link } from 'react-router-dom';

interface RegisterWallPopupProps extends PopupModel {}

const RegisterWallPopup: React.FC<RegisterWallPopupProps> = ({ opened, onCancel, onForceCb }) => {
	return (
		<Modal className="registerWallPopup" open={opened} onCancel={onCancel} footer={null} centered title={null}>
			<div className="registerWallPopupContent">
				<img src={registerImg} alt="register wall asset" className="registerImg" />
				<Typography.Title className="registerWallTitleTxt" level={3}>
					Let's get started!
				</Typography.Title>
				<Typography.Paragraph className="registerWallSubTxt">
					Explore breeders, connect with users and grow your family. You will need to create your account.
				</Typography.Paragraph>
				<Link className="registerWallPopupCta" to="/register">
					<Button type="primary">Get started</Button>
				</Link>
				<Typography.Paragraph className="registerExistingAccount">
					Already have an account? <Link to="/login">Sign in</Link>
				</Typography.Paragraph>
			</div>
		</Modal>
	);
};

export default RegisterWallPopup;
