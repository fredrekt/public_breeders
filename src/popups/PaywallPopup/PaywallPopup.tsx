import React, { useEffect, useState } from 'react';
import './PaywallPopup.scss';
import { PopupModel } from '../../models/PopupModel';
import { Button, Modal, Typography, message } from 'antd';
import registerImg from '../../assets/images/register.png';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { removeToken } from '../../utils/authHelpers';

interface PaywallPopupProps extends PopupModel {}

const { confirm } = Modal;

const PaywallPopup: React.FC<PaywallPopupProps> = ({ opened, onCancel, onForceCb }) => {
	const { user, setUser } = useUserContext();
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
	const [isTabActive, setIsTabActive] = useState(true);

	const onCheckout = () => {
		if (!user) return;
		setIsProcessing(true);
		window.open(
			`${process.env.REACT_APP_STRIPE_SUBSCRIPTION_CHECKOUT_URL}?prefilled_email=${user.email}`,
			'_blank'
		);
	};

	const onCancelPayment = () => {
		if (!user) return;
		confirm({
			title: `Decline Subscription`,
			content: `Are you sure you don't want to use my breeders store?`,
			centered: true,
			onOk() {
				onCancel();
				removeToken();
				console.log('OK');
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	useEffect(() => {
		const handleVisibilityChange = () => {
			setIsTabActive(document.visibilityState === 'visible');
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	const refreshContext = async () => {
		if (!opened) return;
		if (!user) return;
		if (user.isBuyer) return;
		try {
			const userAuth = (await axios.get(`${API_URL}/users/me`)).data;
			if (userAuth.isSubscribed) {
				setPaymentCompleted(true);
				setIsProcessing(false);
				setUser({ ...user, ...userAuth });
				onForceCb();
				onCancel();
				message.success(`Successfully verified subscription payment.`);
			}
		} catch (error) {
			message.error(`Something wen't wrong in getting users data.`);
		}
	};

	useEffect(() => {
		refreshContext();
		// eslint-disable-next-line
	}, [isTabActive, opened]);

	return (
		<Modal
			closable={false}
			className="paywallPopup"
			open={opened}
			onCancel={!paymentCompleted ? onCancelPayment : onCancel}
			footer={null}
			centered
			title={null}
		>
			<div className="paywallPopupContent">
				<img src={registerImg} alt="register wall asset" className="paywallImg" />
				<Typography.Title className="paywallTitleTxt" level={3}>
					Breeder Subscriptions
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
