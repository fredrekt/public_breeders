import React, { useEffect, useState } from 'react';
import './Orderspage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Button, Col, Dropdown, Image, Modal, Row, Typography, message } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import FormatMoney from '../../utils/FormatMoney';
import type { MenuProps } from 'antd';
import ViewOrderDrawer from '../../drawers/ViewOrder/ViewOrderDrawer';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { Model } from '../../models/model';
import { useUserContext } from '../../context/UserContext';
import statusColor from '../../utils/statusColors';
import { randomVector } from '../../utils/randomVector';
import { Api } from '../../models/api';

const { confirm } = Modal;

const Orderspage: React.FC = () => {
	const { user } = useUserContext();
	const [orderStatus, setOrderStatus] = useState<string>('All');
	const [openViewOrder, setOpenViewOrder] = useState<boolean>(false);
	const [orderListing, setOrderListing] = useState<Model.Order[]>([]);
	const [selectedOrder, setSelectedOrder] = useState<Api.Order.Res.OrderListing | null>(null);

	const onChangeOrderStatus = (status: string) => setOrderStatus(status);

	const onViewOrder = () => {
		setOpenViewOrder(true);
	};

	const onCancelOrder = () => {
		confirm({
			title: 'Confirm Txt',
			content: 'Are you sure you want to cancel this order?',
			centered: true,
			onOk() {
				console.log('OK');
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	const onDeleteOrder = () => {
		confirm({
			title: 'Confirm Txt',
			content: 'Are you sure you want to delete this order?',
			centered: true,
			onOk() {
				console.log('OK');
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: (
				<Typography.Text className="orderTableColCta">
					<i className="ri-eye-line"></i> View
				</Typography.Text>
			),
			onClick: () => onViewOrder()
		},
		{
			key: '2',
			label: (
				<Typography.Text className="orderTableColCta">
					<i className="ri-close-circle-line"></i> Cancel
				</Typography.Text>
			),
			disabled: true,
			title: 'Stripe functionality should be finished in order for this to work',
			onClick: () => onCancelOrder()
		},
		{
			key: '3',
			label: (
				<Typography.Text className="orderTableColCta">
					<i className="ri-delete-bin-line"></i> Delete
				</Typography.Text>
			),
			disabled: true,
			className: 'deleteCta',
			title: 'Stripe functionality should be finished in order for this to work',
			onClick: () => onDeleteOrder(),
		}
	];

	const columns: ColumnsType<Model.Order> = [
		{
			title: 'Name',
			dataIndex: '',
			key: 'name',
			render: ({ animal, breeder, ordered_by }) => {
				return (
					<div className="orderTitleContent">
						<Image
							src={(Array.isArray(animal.images) && animal.images.length) ? animal.images[0].url : require(`../../assets/images/vectors/${randomVector}.png`)}
						/>
						<div className="orderTitleBreederContent">
							<Typography.Text className="orderTitleTxt">{animal.name}</Typography.Text>
							<Typography.Text className="orderTitleOwnerTxt">{!user?.isBuyer ? ordered_by.email : breeder.businessName}</Typography.Text>
						</div>
					</div>
				);
			}
		},
		{
			title: 'Price',
			dataIndex: 'animal',
			key: 'age',
			render: (animal: Model.Animal) => {
				return FormatMoney(animal.price);
			}
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: (status) => (
				<Tag className="orderStatusTag" color={statusColor(status)} key={`id-${status}`}>
					{status.toLowerCase()}
				</Tag>
			)
		},
		{
			title: 'Address',
			dataIndex: 'addressLine1',
			key: 'address'
		},
		{
			title: 'Description',
			dataIndex: 'itemDescription',
			key: 'itemDescription'
		},
		{
			title: 'Payment Status',
			key: 'paymentStatus',
			dataIndex: 'paymentStatus',
			render: (status) => (
				<Tag className="orderStatusTag" color={statusColor(status)} key={`id-${status}`}>
					{status.toLowerCase()}
				</Tag>
			)
		},
		{
			title: '',
			dataIndex: '',
			key: 'action',
			render: (record) => (
				<Dropdown
					overlayClassName="ordersTableColCtaDropdown"
					trigger={['click']}
					menu={{ items }}
					onOpenChange={() => setSelectedOrder(record)}
					placement="bottom"
					arrow={{ pointAtCenter: true }}
				>
					<Button size="small">
						<i className="ri-more-2-line"></i>
					</Button>
				</Dropdown>
			)
		}
	];

	const loadListOfOrders = async () => {
		if (!user) return;
		try {
			let qry = `?populate=deep,5&filters[status][$eq]=${orderStatus}`;
			const res = (await axios.get(`${API_URL}/orders${qry}`)).data;
			if (res) {
				console.log(JSON.stringify(res))
				setOrderListing(res);
			}
		} catch (error) {
			message.error(`Something wen't wrong in getting list of orders.`);
		}
	}

	useEffect(() => {
		loadListOfOrders();
		// eslint-disable-next-line
	}, [orderStatus, user]);

	return (
		<PrivateLayout className="ordersPage customLayoutWidth">
			<PageTitle title="Orders" />
			<Row className="ordersFilterContainer">
				<Col lg={24}>
					<ButtonGroup>
						<Button
							onClick={() => onChangeOrderStatus('All')}
							type={orderStatus === 'All' ? 'primary' : 'default'}
						>
							All
						</Button>
						<Button
							onClick={() => onChangeOrderStatus('PENDING')}
							type={orderStatus === 'PENDING' ? 'primary' : 'default'}
						>
							Pending
						</Button>
						<Button
							onClick={() => onChangeOrderStatus('DELIVERED')}
							type={orderStatus === 'DELIVERED' ? 'primary' : 'default'}
						>
							Delivered
						</Button>
						<Button
							onClick={() => onChangeOrderStatus('CANCELLED')}
							type={orderStatus === 'CANCELLED' ? 'primary' : 'default'}
						>
							Cancelled
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<div className="ordersTableContainer">
				<Table columns={columns} dataSource={orderListing} />
				{selectedOrder && <ViewOrderDrawer
					opened={openViewOrder}
					order={selectedOrder}
					onCancel={() => setOpenViewOrder(false)}
					onForceCb={() => console.log('object')}
				/>}
			</div>
		</PrivateLayout>
	);
};

export default Orderspage;
