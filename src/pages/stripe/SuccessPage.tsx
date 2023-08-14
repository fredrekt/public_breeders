import React from 'react';
import './SuccessPage.scss';
import { Button, Result } from 'antd';

const SuccessPage: React.FC = () => {
	return (
		<div className="customStripeSuccessOnboardingPage absolute-centered">
			<Result
				className="customOnboardingResult"
				status="success"
				title="Successfully onboarded"
				subTitle="Breeder successfully setup stripe payout account. If you have any concerns/questions please reach out to support@studiolore.com.au."
				extra={[
					<Button onClick={() => window.close()} type="primary" key="console">
						Return to My Breeders Store
					</Button>
				]}
			/>
		</div>
	);
};

export default SuccessPage;
