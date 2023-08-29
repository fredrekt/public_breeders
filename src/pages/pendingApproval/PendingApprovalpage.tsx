import React from 'react';
import './PendingApprovalpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const PendingApprovalpage: React.FC = () => {
	return (
		<PublicLayout navbar className="pendingApprovalPage">
			<Result
				className="customPendingApprovalResult"
				title="Pending Approval"
				subTitle={
					<span>
						Your account is successfully registered, it will undergo through an approval process by My Breeders Store. If you have any concerns/questions please
						reach out to <a href="mailto:hello@mybreedersstore.com">hello@mybreedersstore.com</a>
					</span>
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
