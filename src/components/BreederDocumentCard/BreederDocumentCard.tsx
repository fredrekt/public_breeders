import React, { useState } from 'react';
import './BreederDocumentCard.scss';
import { Button, Card, Typography } from 'antd';
import ViewDocumentDrawer from '../../drawers/ViewDocument/ViewDocumentDrawer';

interface BreederDocumentCardProps {
	title: string;
	primary?: boolean;
	animalPage?: boolean;
}

const BreederDocumentCard: React.FC<BreederDocumentCardProps> = ({ title, primary, animalPage }) => {
	const [openViewDocument, setOpenViewDocument] = useState<boolean>(false);
	return (
		<Card className={`breederDocumentCard ${primary ? 'primaryColor' : 'tertiaryColor'}`}>
			<div className="breederDocumentCardContent">
				<Typography.Title className="breederDocumentTitle" level={animalPage ? 5 : 4}>
					{title}
				</Typography.Title>
				<Button onClick={() => setOpenViewDocument(true)} type="link">
					View
				</Button>
			</div>
			<ViewDocumentDrawer
				title={title}
				opened={openViewDocument}
				onCancel={() => setOpenViewDocument(false)}
				onForceCb={() => console.log('object')}
			/>
		</Card>
	);
};

export default BreederDocumentCard;
