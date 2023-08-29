import React, { useEffect, useState } from 'react';
import './PendingApprovalpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Result, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import PageLoader from '../../components/PageLoader/PageLoader';

const PendingApprovalpage: React.FC = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const actionType: string | null = queryParams.get('type');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (actionType) {
			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		}
        // eslint-disable-next-line
	}, []);

	if (isLoading && actionType) return <PageLoader />;

	return (
		<PublicLayout navbar className="pendingApprovalPage">
			<Result
				status={!actionType ? 'info' : `${actionType === 'approve' ? 'success' : 'error'}`}
				className="customPendingApprovalResult"
				title={
					!actionType
						? 'Pending Approval'
						: `Breeder successfully ${actionType === 'approve' ? 'approved' : 'denied'}.`
				}
				subTitle={
					!actionType ? (
						<span>
							Your account is successfully registered, it will undergo through an approval process by My
							Breeders Store. If you have any concerns/questions please reach out to{' '}
							<a href="mailto:hello@mybreedersstore.com">hello@mybreedersstore.com</a>
						</span>
					) : (
						<span>
							{actionType === 'approve'
								? 'The breeder has been granted permission to utilize the My Breeders Store Platform.'
								: "The breeder's request to access the My Breeders Store Platform has been declined."}
						</span>
					)
				}
				extra={[
					<Link to="/">
						<Button type="primary" key="console">
							Go Home
						</Button>
					</Link>
				]}
			/>
		</PublicLayout>
	);
};

export default PendingApprovalpage;
