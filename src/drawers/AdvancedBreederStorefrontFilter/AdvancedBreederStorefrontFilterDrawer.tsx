import React from 'react';
import './AdvancedBreederStorefrontFilterDrawer.scss';
import { DrawerModel } from '../../models/DrawerModel';
import { Drawer, Result } from 'antd';
import dogImg from '../../assets/images/register.png';

interface AdvancedBreederStorefrontFilterDrawerProps extends DrawerModel {}

const AdvancedBreederStorefrontFilterDrawer: React.FC<AdvancedBreederStorefrontFilterDrawerProps> = ({
	opened,
	onCancel,
	onForceCb
}) => {
	return (
		<Drawer
			className="advancedBreedersFilterDrawer"
			title={`Advanced Filters`}
			open={opened}
			onClose={onCancel}
			placement="right"
			width={512}
		>
			<Result
				icon={<img src={dogImg} alt="missing" />}
				title="In progress"
				subTitle="Sorry, the page/functionality you visited does not exist."
			/>
		</Drawer>
	);
};

export default AdvancedBreederStorefrontFilterDrawer;
