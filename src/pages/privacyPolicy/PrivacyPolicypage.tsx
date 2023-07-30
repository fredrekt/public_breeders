import React, { useEffect, useState } from 'react';
import './PrivacyPolicypage.scss';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { message } from 'antd';
// import { getToken } from '../../utils/authHelpers';
// import ProtectedRoute from '../../utils/ProtectedRoute';
// import PrivateLayout from '../../layouts/private/PrivateLayout';
// import PublicLayout from '../../layouts/public/PublicLayout';
import ReactMarkdown from 'react-markdown';

const PrivacyPolicypage: React.FC = () => {
	// const loggedIn: boolean = getToken() !== '';
	const [content, setContent] = useState<any>();

	const loadTerms = async () => {
		try {
			const { data } = (await axios(`${API_URL}/privacy-policy`)).data;
			setContent(data.content);
		} catch (error) {
			message.error(`Failed to load terms and conditons data.`);
		}
	};

	useEffect(() => {
		loadTerms();
	}, []);

	// const renderContent = () => {
	// 	if (loggedIn) {
	// 		return (
	// 			<ProtectedRoute>
	// 				<PrivateLayout className="privateTermsAndConditionsPage">
	// 					<ReactMarkdown className="richtextContent">{content}</ReactMarkdown>
	// 				</PrivateLayout>
	// 			</ProtectedRoute>
	// 		);
	// 	} else {
	// 		return (
	// 			<PublicLayout navbar className="publicTermsAndConditionsPage">
	// 				<ReactMarkdown className="richtextContent">{content}</ReactMarkdown>
	// 			</PublicLayout>
	// 		);
	// 	}
	// };

	// return renderContent();
	return (
		<div className="publicTermsAndConditionsPage">
			<ReactMarkdown className="richtextContent">{content}</ReactMarkdown>
		</div>
	);
};

export default PrivacyPolicypage;
