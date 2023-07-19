import React from 'react';
import './ViewProductDrawer.scss';
import { DrawerModel } from '../../models/DrawerModel';
import { Col, Drawer, Row, Typography } from 'antd';
import { Api } from '../../models/api';
import BreederCard from '../../components/BreederCard/BreederCard';
import { useUserContext } from '../../context/UserContext';

interface ViewProductDrawerProps extends DrawerModel {
	animal: Api.Animal.Res.AnimalListing;
}

const ViewProductDrawer: React.FC<ViewProductDrawerProps> = ({ opened, onCancel, animal }) => {
	const { user } = useUserContext();

	const renderAnimalData = () => {
		if (!user || user.isBuyer) return;
		if (!user.breeder) return;
		if (!animal) return;
		return (
			<Row align={'middle'} justify={'center'}>
				<Col xs={24} sm={24} md={24} lg={20} xl={20} xxl={20}>
					<BreederCard
						id={animal.id}
						name={animal.name}
						previewUrl={Array.isArray(animal.images) && animal.images.length ? animal.images[0].url : ''}
						ownerId={user.breeder.id}
						ownerName={user.breeder.businessName}
						ownerProfileImageUrl={user.breeder.avatar ? user.breeder.avatar.url : ''}
						pricing={animal.price}
					/>
				</Col>
			</Row>
		);
	};
	return (
		<Drawer width={512} title="View Product" className="viewProductDrawer" open={opened} onClose={onCancel}>
			<Typography.Paragraph className='viewProductSubTxt'>
                On the market, it would appear like this.
            </Typography.Paragraph>
            {renderAnimalData()}
		</Drawer>
	);
};

export default ViewProductDrawer;
