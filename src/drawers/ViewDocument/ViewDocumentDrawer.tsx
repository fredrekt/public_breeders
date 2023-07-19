import React from 'react';
import { DrawerModel } from '../../models/DrawerModel';
import { Drawer } from 'antd';
import './ViewDocumentDrawer.scss';

interface ViewDocumentDrawerProps extends DrawerModel {
	title: string;
	file: string;
}

const ViewDocumentDrawer: React.FC<ViewDocumentDrawerProps> = ({ title, opened, onCancel, file }) => {
	return (
		<Drawer
			className="viewDocumentDrawer"
			title={`Viewing ${title}`}
			open={opened}
			onClose={onCancel}
			placement="bottom"
			width={`100%`}
			height={`100%`}
		>
			<iframe title={title} src={file || require('../../assets/pdf/document_test.pdf')} height={`100%`} width={`100%`} />
		</Drawer>
	);
};

export default ViewDocumentDrawer;
