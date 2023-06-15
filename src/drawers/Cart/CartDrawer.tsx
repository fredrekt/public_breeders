import React from 'react';
import './CartDrawer.scss';
import { DrawerModel } from '../../models/DrawerModel';
import { Drawer, Result } from 'antd';
import dogImg from '../../assets/images/register.png';

interface CartDrawerProps extends DrawerModel {}

const CartDrawer: React.FC<CartDrawerProps> = ({ opened, onCancel, onForceCb }) => {
	return (
		<Drawer className="cartDrawer" title={`Cart`} open={opened} onClose={onCancel} placement="right" width={512}>
			<Result
				icon={<img src={dogImg} alt="missing" />}
				title="In progress"
				subTitle="Sorry, the page/functionality you visited does not exist."
			/>
		</Drawer>
	);
};

export default CartDrawer;
