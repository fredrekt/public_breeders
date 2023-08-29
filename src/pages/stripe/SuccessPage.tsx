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
				subTitle={<span>Breeder successfully setup stripe payout account. If you have any concerns/questions please reach out to <a href="mailto:hello@mybreedersstore.com">hello@mybreedersstore.com</a></span>}
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
