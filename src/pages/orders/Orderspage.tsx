import React, { useState } from 'react';
import './Orderspage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Button, Col, Dropdown, Image, Modal, Row, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import FormatMoney from '../../utils/FormatMoney';
import type { MenuProps } from 'antd';
import ViewOrderDrawer from '../../drawers/ViewOrder/ViewOrderDrawer';

interface DataType {
	key: string;
	name: string;
	age: number;
	address: string;
	status: string[];
}

const data: DataType[] = [
	{
		key: '1',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		status: ['Delivered', 'Pending']
	},
	{
		key: '2',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		status: ['Cancelled']
	},
	{
		key: '3',
		name: 'Joe Black',
		age: 32,
		address: 'Sydney No. 1 Lake Park',
		status: ['Delievered']
	},
	{
		key: '4',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		status: ['Delivered', 'Pending']
	},
	{
		key: '5',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		status: ['Cancelled']
	},
	{
		key: '6',
		name: 'Joe Black',
		age: 32,
		address: 'Sydney No. 1 Lake Park',
		status: ['Delievered']
	},
	{
		key: '11',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		status: ['Delivered', 'Pending']
	},
	{
		key: '22',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		status: ['Cancelled']
	},
	{
		key: '33',
		name: 'Joe Black',
		age: 32,
		address: 'Sydney No. 1 Lake Park',
		status: ['Delievered']
	},
	{
		key: '44',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		status: ['Delivered', 'Pending']
	},
	{
		key: '55',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		status: ['Cancelled']
	},
	{
		key: '66',
		name: 'Joe Black',
		age: 32,
		address: 'Sydney No. 1 Lake Park',
		status: ['Delievered']
	}
];

const { confirm } = Modal;

const Orderspage: React.FC = () => {
	const [orderStatus, setOrderStatus] = useState<string>('All');
	const [openViewOrder, setOpenViewOrder] = useState<boolean>(false);

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
				<Typography.Text onClick={onViewOrder} className="orderTableColCta">
					<i className="ri-eye-line"></i> View
				</Typography.Text>
			)
		},
		{
			key: '2',
			label: (
				<Typography.Text onClick={onCancelOrder} className="orderTableColCta">
					<i className="ri-close-circle-line"></i> Cancel
				</Typography.Text>
			)
		},
		{
			key: '3',
			label: (
				<Typography.Text onClick={onDeleteOrder} className="orderTableColCta">
					<i className="ri-delete-bin-line"></i> Delete
				</Typography.Text>
			),
			className: 'deleteCta'
		}
	];

	const columns: ColumnsType<DataType> = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text) => {
				return (
					<div className="orderTitleContent">
						<Image
							src={
								'https://images.pexels.com/photos/2774140/pexels-photo-2774140.jpeg?auto=compress&cs=tinysrgb&w=1600'
							}
						/>
						<div className="orderTitleBreederContent">
							<Typography.Text className="orderTitleTxt">{text}</Typography.Text>
							<Typography.Text className="orderTitleOwnerTxt">Fred Garingo</Typography.Text>
						</div>
					</div>
				);
			}
		},
		{
			title: 'Price',
			dataIndex: 'age',
			key: 'age',
			render: (age) => {
				return FormatMoney(age);
			}
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address'
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: (_, { status }) => (
				<>
					{status.map((tag) => {
						let color = tag.length > 5 ? 'geekblue' : 'green';
						if (tag === 'Cancelled') {
							color = 'volcano';
						} else if (tag === 'Delievered') {
							color = 'success';
						} else if (tag === 'Pending') {
							color = '';
						}
						return (
							<Tag className="orderStatusTag" color={color} key={tag}>
								{tag}
							</Tag>
						);
					})}
				</>
			)
		},
		{
			title: '',
			key: 'action',
			render: (_, record) => (
				<Dropdown
					overlayClassName="ordersTableColCtaDropdown"
					trigger={['click']}
					menu={{ items }}
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
							onClick={() => onChangeOrderStatus('Pending')}
							type={orderStatus === 'Pending' ? 'primary' : 'default'}
						>
							Pending
						</Button>
						<Button
							onClick={() => onChangeOrderStatus('Delivered')}
							type={orderStatus === 'Delivered' ? 'primary' : 'default'}
						>
							Delivered
						</Button>
						<Button
							onClick={() => onChangeOrderStatus('Cancelled')}
							type={orderStatus === 'Cancelled' ? 'primary' : 'default'}
						>
							Cancelled
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<div className="ordersTableContainer">
				<Table columns={columns} dataSource={data} />
			</div>
			<ViewOrderDrawer
				opened={openViewOrder}
				onCancel={() => setOpenViewOrder(false)}
				onForceCb={() => console.log('object')}
			/>
		</PrivateLayout>
	);
};

export default Orderspage;
