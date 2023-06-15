import React from 'react';
import { DrawerModel } from '../../models/DrawerModel';
import './ViewOrderDrawer.scss';
import { Drawer } from 'antd';

interface ViewOrderDrawerProps extends DrawerModel {}

const ViewOrderDrawer: React.FC<ViewOrderDrawerProps> = ({ opened, onCancel }) => {
	return (
		<Drawer width={512} title="Order Details" className="viewOrderDrawer" open={opened} onClose={onCancel}></Drawer>
	);
};

export default ViewOrderDrawer;
