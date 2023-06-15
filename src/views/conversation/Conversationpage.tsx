import React from 'react';
import './Conversationpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';

const Conversationpage: React.FC = () => {
	return (
		<PrivateLayout className="conversationPage customLayoutWidth">
			<PageTitle title="Inbox" />
		</PrivateLayout>
	);
};

export default Conversationpage;
