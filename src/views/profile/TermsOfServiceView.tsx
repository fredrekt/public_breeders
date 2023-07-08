import { Card, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../utils/constant';

const TermsOfServiceView: React.FC = () => {
	const [content, setContent] = useState<any>();
	
	const loadTerms = async () => {
		try {
			const { data } = (await axios(`${API_URL}/terms-and-condition`)).data;
			setContent(data.content);
		} catch (error) {
			message.error(`Failed to load terms and conditons data.`);
		}
	}

	useEffect(() => {
		loadTerms();
	}, []);
	
	return (
		<Card>
			{content}
		</Card>
	);
};

export default TermsOfServiceView;
