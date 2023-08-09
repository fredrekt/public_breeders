import React, { useState } from 'react';
import './PaywallPopup.scss';
import { PopupModel } from '../../models/PopupModel';
import { Button, Modal, Typography } from 'antd';
import registerImg from '../../assets/images/register.png';

interface PaywallPopupProps extends PopupModel {}

const { confirm } = Modal;

const PaywallPopup: React.FC<PaywallPopupProps> = ({ opened, onCancel, onForceCb }) => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const onCheckout = () => {
		window.open(process.env.REACT_APP_STRIPE_SUBSCRIPTION_CHECKOUT_URL, '_blank');
		setIsProcessing(true);
	}

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
				<Button className='paywallCta' disabled={isProcessing} loading={isProcessing} onClick={onCheckout} type="primary">{!isProcessing ? `Proceed to checkout` : `Processing payment`}</Button>
				{!isProcessing && <Typography.Paragraph className="paywallFooterHelp">
					Already have an active subscription? <a href="mailto:help@mybreedersstore.com">Need Help</a>
				</Typography.Paragraph>}
			</div>
		</Modal>
	);
};

export default PaywallPopup;
