import React, { useEffect, useState } from 'react';
import './TermsAndConditionsPage.scss';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { Card, Typography, message } from 'antd';
import { getToken } from '../../utils/authHelpers';
import ProtectedRoute from '../../utils/ProtectedRoute';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PublicLayout from '../../layouts/public/PublicLayout';
import ReactMarkdown from 'react-markdown';
import legalImg from '../../assets/images/terms_and_conditions.svg';

interface PageHeaderLegalProps {
	title: string;
	img: string;
}

export const PageHeaderLegal: React.FC<PageHeaderLegalProps> = ({ title, img }) => {
	return (
		<div className="pageHeaderLegal">
			<img src={img} alt="page legal icon" className="legalImgIcon" />
			<Typography.Title level={2} className="legalPageTitle">
				{title}
			</Typography.Title>
		</div>
	);
};

const TermsAndConditionsPage: React.FC = () => {
	const loggedIn: boolean = getToken() !== '';
	const [content, setContent] = useState<any>();

	const loadTerms = async () => {
		try {
			const { data } = (await axios(`${API_URL}/terms-and-condition`)).data;
			setContent(data.content);
		} catch (error) {
			message.error(`Failed to load terms and conditons data.`);
		}
	};

	useEffect(() => {
		loadTerms();
	}, []);

	const renderContent = () => {
		if (loggedIn) {
			return (
				<ProtectedRoute>
					<PrivateLayout className="privateTermsAndConditionsPage">
						<Card>
							<PageHeaderLegal title="MY BREEDERS STORE PLATFORM TERMS AND CONDITIONS" img={legalImg} />
							<ReactMarkdown className="richtextContent">{content}</ReactMarkdown>
						</Card>
					</PrivateLayout>
				</ProtectedRoute>
			);
		} else {
			return (
				<PublicLayout navbar className="publicTermsAndConditionsPage">
					<Card>
						<PageHeaderLegal title="MY BREEDERS STORE PLATFORM TERMS AND CONDITIONS" img={legalImg} />
						<ReactMarkdown className="richtextContent">{content}</ReactMarkdown>
					</Card>
				</PublicLayout>
			);
		}
	};

	return renderContent();
};

export default TermsAndConditionsPage;
