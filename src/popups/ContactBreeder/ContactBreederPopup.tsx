import React, { useState } from 'react';
import './ContactBreederPopup.scss';
import { Input, Modal, Typography, message } from 'antd';
import { PopupModel } from '../../models/PopupModel';
import AnimalBreederInfo from '../../components/AnimalBreederInfo/AnimalBreederInfo';
import { Model } from '../../models/model';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { randomVector } from '../../utils/randomVector';

interface ContactBreederPopupProps extends PopupModel {
	breeder: Model.Breeder | null;
}

const ContactBreederPopup: React.FC<ContactBreederPopupProps> = ({ opened, onCancel, onForceCb, breeder }) => {
	const [messageInput, setMessageInput] = useState<string>('');

	const onSendMessage = async () => {
		if (!breeder) return;
		try {
			const res = await axios.post(`${API_URL}/conversations`, {
				breederId: breeder.id,
				message: messageInput
			});
			if (res) {
				onCancel();
				onForceCb();
				message.success(`Successfully sent a message to breeder.`);
			} 
		} catch (error) {
			message.error(`Something wen't wrong in sending a message.`);
		}
	};

	const onReset = () => {
		setMessageInput('');
	}

	return (
		<Modal
			okText="Send Message"
			cancelButtonProps={{ type: 'ghost' }}
			title="Send Message"
			open={opened}
			onCancel={onCancel}
			centered
			onOk={onSendMessage}
			afterClose={onReset}
			className="contactBreederPopup"
		>
			{breeder && <div className="contactBreederInfo">
				<AnimalBreederInfo
					breederId={breeder.id}
					name={breeder.businessName}
					avatarUrl={breeder.avatar ? breeder.avatar.url : require(`../../assets/images/vectors/${randomVector}.png`)}
					description={breeder.aboutBusiness}
					address={breeder.businessAddress}
					verified={breeder.isVerified}
				/>
			</div>}
			<div className="contactBreederInput">
				<Typography.Title className="contactBreederInputTxt" level={5}>
					Message
				</Typography.Title>
				<Input.TextArea value={messageInput} onChange={(e: any) => setMessageInput(e.target.value)} rows={5} />
			</div>
		</Modal>
	);
};

export default ContactBreederPopup;
