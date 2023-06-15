import React from 'react';
import { DrawerModel } from '../../models/DrawerModel';
import { Drawer } from 'antd';
import './ViewDocumentDrawer.scss';

interface ViewDocumentDrawerProps extends DrawerModel {
	title: string;
}

const ViewDocumentDrawer: React.FC<ViewDocumentDrawerProps> = ({ title, opened, onCancel }) => {
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
			<object
				data="http://africau.edu/images/default/sample.pdf"
				type="application/pdf"
				width="100%"
				height="100%"
			>
				<p>
					Alternative text - include a link{' '}
					<a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a>
				</p>
			</object>
		</Drawer>
	);
};

export default ViewDocumentDrawer;
