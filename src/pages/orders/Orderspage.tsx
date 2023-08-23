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
import statusText from '../../utils/statusText';

const { confirm } = Modal;

const Orderspage: React.FC = () => {
	const { user } = useUserContext();
	const [orderStatus, setOrderStatus] = useState<string>('All');
	const [openViewOrder, setOpenViewOrder] = useState<boolean>(false);
	const [orderListing, setOrderListing] = useState<Model.Order[]>([]);
	const [selectedOrder, setSelectedOrder] = useState<Api.Order.Res.OrderListing | null>(null);
	const [forceUpdate, setForceUpdate] = useState<boolean>(false);

	const onChangeOrderStatus = (status: string) => setOrderStatus(status);

	const onViewOrder = () => {
		setOpenViewOrder(true);
	};

	const onReceivedOrder = async () => {
		if (!selectedOrder) return;
		confirm({
			title: 'Order Received',
			content: 'Are you sure to mark this order as received?',
			centered: true,
			okText: 'Yes, i received it',
			async onOk() {
				try {
					const res = await axios.put(`${API_URL}/orders/${selectedOrder.id}`, {
						data: {
							status: 'DELIVERED',
							isReceivedByUser: true,
							isDeliveredByBreeder: true
						}
					});
					if (res) {
						setForceUpdate(!forceUpdate);
						message.success(`Order marked as received.`);
					}
				} catch (error) {
					message.error(`Something wen't wrong in marking order as received.`)
				}
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	}

	const onCancelOrder = async () => {
		if (!selectedOrder) return;
		confirm({
			title: 'Cancel Order',
			content: 'Are you sure you want to cancel this order?',
			centered: true,
			async onOk() {
				try {
					const res = await axios.put(`${API_URL}/orders/${selectedOrder.id}`, {
						data: {
							status: 'CANCELLED'
						}
					});
					if (res) {
						setForceUpdate(!forceUpdate);
						message.success(`Order successfully cancelled and will refund user.`);
					}
				} catch (error) {
					message.error(`Something wen't wrong in cancelling order.`)
				}
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	const onMarkSent = async () => {
		if (!selectedOrder) return;
		confirm({
			title: 'Dispatch Order',
			content: 'Is the ordered product on its way?',
			centered: true,
			async onOk() {
				try {
					const res = await axios.put(`${API_URL}/orders/${selectedOrder.id}`, {
						data: {
							status: 'IN_TRANSIT'
						}
					});
					if (res) {
						setForceUpdate(!forceUpdate);
						message.success(`Order successfully marked sent & its on the way.`);
					}
				} catch (error) {
					message.error(`Something wen't wrong in marking the order in transit.`)
				}
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	}

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
					{statusText(status)}
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
			render: (record) => {
				if (!user) return;
				let items: MenuProps['items'] = [
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
								<i className="ri-award-line"></i> Received
							</Typography.Text>
						),
						disabled: record.status === 'DELIVERED' || record.isReceivedByUser ? true : false,
						className: 'receivedCta',
						onClick: () => onReceivedOrder()
					},
					{
						key: '3',
						label: (
							<Typography.Text className="orderTableColCta">
								<i className="ri-checkbox-circle-line"></i> Mark sent
							</Typography.Text>
						),
						disabled: record.status === 'IN_TRANSIT' ? true : false,
						className: 'receivedCta',
						title: 'Stripe functionality should be finished in order for this to work',
						onClick: () => onMarkSent()
					},
					{
						key: '4',
						label: (
							<Typography.Text className="orderTableColCta" title='Cannot cancel order if order is in transit.'>
								<i className="ri-close-circle-line"></i> Cancel
							</Typography.Text>
						),
						disabled: record.status === 'IN_TRANSIT' || record.status === 'DELIVERED' ? true : false,
						className: 'deleteCta',
						title: 'Stripe functionality should be finished in order for this to work',
						onClick: () => onCancelOrder(),
					}
				];
				if (user.isBuyer) {
					items = items.slice(0, -2);
				} else {
					items = items.filter((item: any) => item.key !== '2');
				}
				return (
					<>
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
					</>
				)
			}
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
	}, [orderStatus, user, forceUpdate]);

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
							onClick={() => onChangeOrderStatus('IN_TRANSIT')}
							type={orderStatus === 'IN_TRANSIT' ? 'primary' : 'default'}
						>
							In Transit
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
