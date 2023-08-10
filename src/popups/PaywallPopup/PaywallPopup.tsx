import React, { useState } from 'react';
import './PaywallPopup.scss';
import { PopupModel } from '../../models/PopupModel';
import { Button, Modal, Typography, message } from 'antd';
import registerImg from '../../assets/images/register.png';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { API_URL } from '../../utils/constant';

interface PaywallPopupProps extends PopupModel {}

const { confirm } = Modal;

const PaywallPopup: React.FC<PaywallPopupProps> = ({ opened, onCancel, onForceCb }) => {
	const { user, setUser } = useUserContext();
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const onCheckout = () => {
		if (!user) return;
		setIsProcessing(true);
		const newWindow = window.open(
			`${process.env.REACT_APP_STRIPE_SUBSCRIPTION_CHECKOUT_URL}?prefilled_email=${user.email}`,
			'_blank',
			`width=600,height=600,left=${(window.innerWidth - 600) / 2},top=${(window.innerHeight - 600) / 2}`
		);
		const checkClosedInterval = setInterval(() => {
			if (newWindow && newWindow.closed) {
				clearInterval(checkClosedInterval);
				// Perform actions when the window is closed
				console.log('Child window has been closed');
				setIsProcessing(false);
				updateBreederAccess();
			}
		}, 1000); // Check every 1 second
	};

	const onCancelPayment = () => {
		confirm({
			title: 'Are you sure you want to abandon this transaction?',
			content: 'Closing this popup before the transaction is complete is not reversible.',
			centered: true,
			onOk() {
				onCancel();
				console.log('OK');
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	const updateBreederAccess = async () => {
		if (!user) return;
		try {
			const update = await axios.put(`${API_URL}/users/${user.id}?populate=avatar`, {
				isSubscribed: true
			});
			if (update.data) {
				setUser({ ...user, ...update.data });
				onCancel();
				message.success(`Successfully subscribed to my breeders store.`);
				setTimeout(() => {
					window.location.reload();
				}, 500);
			}
		} catch (error) {
			message.error(`Something wen't wrong in subscribing to my breeders store.`);
		}
	};

	return (
		<Modal
			closable={false}
			className="paywallPopup"
			open={opened}
			onCancel={isProcessing ? onCancelPayment : onCancel}
			footer={null}
			centered
			title={null}
		>
			<div className="paywallPopupContent">
				<img src={registerImg} alt="register wall asset" className="paywallImg" />
				<Typography.Title className="paywallTitleTxt" level={3}>
					Breeder Subscription
				</Typography.Title>
				<Typography.Paragraph className="paywallSubTxt">
					Explore breeder's priviledges & market your products. Browse other breeder's collections.
				</Typography.Paragraph>
				<Button
					className="paywallCta"
					disabled={isProcessing}
					loading={isProcessing}
					onClick={onCheckout}
					type="primary"
				>
					{!isProcessing ? `Proceed to checkout` : `Processing payment`}
				</Button>
				{!isProcessing && (
					<Typography.Paragraph className="paywallFooterHelp">
						Already have an active subscription? <a href="mailto:help@mybreedersstore.com">Need Help</a>
					</Typography.Paragraph>
				)}
			</div>
		</Modal>
	);
};

export default PaywallPopup;
