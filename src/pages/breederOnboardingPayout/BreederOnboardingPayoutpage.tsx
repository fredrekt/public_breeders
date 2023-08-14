import React, { useState } from 'react';
import './BreederOnboardingPayoutpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import { Button, message } from 'antd';
import axios from 'axios';
import { API_URL } from '../../utils/constant';

const BreederOnboardingPayoutpage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

	const startOnboarding = async () => {
        setIsLoading(true);
		try {
            const res = (await axios.post(`${API_URL}/breeder/stripe/setup-account`)).data;
            if (res) {
                if (!res.onboarding_url) return;
                const newWindow = window.open(
                    `${res.onboarding_url}`,
                    '_blank',
                    `width=600,height=600,left=${(window.innerWidth - 600) / 2},top=${(window.innerHeight - 600) / 2}`
                );
                const checkClosedInterval = setInterval(() => {
                    if (newWindow && newWindow.closed) {
                        clearInterval(checkClosedInterval);
                        // Perform actions when the window is closed
                        console.log('Child window has been closed');
                        setIsLoading(false);
                        // updateBreederAccess();
                    }
                }, 1000); // Check every 1 second
            }
		} catch (error) {
            setIsLoading(false);
			message.error(`Something wen't wrong in creating a breeder payout account.`);
		}
	};
	return (
		<PrivateLayout className="breederOnboardingPayoutpage customLayoutWidth">
			<Button disabled={isLoading} loading={isLoading} onClick={startOnboarding} type="primary">{isLoading ? `Processing` : `Setup Payout Account`}</Button>
		</PrivateLayout>
	);
};

export default BreederOnboardingPayoutpage;
