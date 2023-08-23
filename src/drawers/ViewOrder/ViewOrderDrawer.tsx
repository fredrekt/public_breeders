import React from 'react';
import { DrawerModel } from '../../models/DrawerModel';
import './ViewOrderDrawer.scss';
import { Descriptions, Drawer, Tag, Typography } from 'antd';
import { Api } from '../../models/api';
import BreederCard from '../../components/BreederCard/BreederCard';
import { useUserContext } from '../../context/UserContext';
import AnimalBreederInfo from '../../components/AnimalBreederInfo/AnimalBreederInfo';
import { randomVector } from '../../utils/randomVector';
import statusColor from '../../utils/statusColors';
import statusText from '../../utils/statusText';

interface ViewOrderDrawerProps extends DrawerModel {
	order: Api.Order.Res.OrderListing | null;
}

const ViewOrderDrawer: React.FC<ViewOrderDrawerProps> = ({ opened, onCancel, order }) => {
	const { user } = useUserContext();

	const renderAnimalDetails = () => {
		if (!order || !order.animal) return;
		return (
			<BreederCard
				id={order.animal.id}
				name={order.animal.name}
				previewUrl={Array.isArray(order.animal.images) && order.animal.images.length ? order.animal.images[0].url : ''}
				ownerId={order.breeder.id}
				ownerName={order.breeder.businessName}
				ownerProfileImageUrl={order.breeder.avatar ? order.breeder.avatar.url : ''}
				pricing={order.animal.price}
			/>
		);
	};

	const renderBuyerDetails = () => {
		if (!user) return;
		if (!order || !order.breeder) return;
		return (
			<div>
				<Typography.Title level={5}>{user.isBuyer ? `Order Details` : null}</Typography.Title>
				{user.isBuyer ? (
					<AnimalBreederInfo
						breederId={order.breeder.id}
						name={order.breeder.businessName}
						avatarUrl={
							order.breeder.avatar
								? order.breeder.avatar.url
								: require(`../../assets/images/vectors/${randomVector}.png`)
						}
						description={order.breeder.aboutBusiness}
						address={order.breeder.businessAddress}
						verified={order.breeder.isVerified}
					/>
				) : (
					<>
						<Descriptions layout='vertical' title="User Details">
							<Descriptions.Item label="User">{order.ordered_by.firstName} {order.ordered_by.lastName}</Descriptions.Item>
							<Descriptions.Item label="Email">{order.ordered_by.email}</Descriptions.Item>
							<Descriptions.Item label="Received by user">{!order.isReceivedByUser ? 'No' : 'Yes'}</Descriptions.Item>
							<Descriptions.Item label="Status"><Tag className='viewOrderStatusTag' color={statusColor(order.status)}>{statusText(order.status)}</Tag></Descriptions.Item>
							<Descriptions.Item label="Address">
								{order.addressLine1}
							</Descriptions.Item>
						</Descriptions>

						<Descriptions layout='vertical' title="Additional Address Information">
							<Descriptions.Item label="Unit #">{order.addressUnitNumber || 'N/A'}</Descriptions.Item>
							<Descriptions.Item label="State">{order.addressState || 'N/A'}</Descriptions.Item>
							<Descriptions.Item label="City">{order.addressCity || 'N/A'}</Descriptions.Item>
							<Descriptions.Item label="Postal">{order.addressPostalCode || 'N/A'}</Descriptions.Item>
						</Descriptions>
					</>
				)}
			</div>
		);
	};

	return (
		<Drawer width={512} title="Order Details" className="viewOrderDrawer" open={opened} onClose={onCancel}>
			{renderAnimalDetails()}
			{renderBuyerDetails()}
		</Drawer>
	);
};

export default ViewOrderDrawer;
