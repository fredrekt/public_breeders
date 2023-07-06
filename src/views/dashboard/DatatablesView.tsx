import React, { useState, useEffect } from 'react';
import './DatatablesView.scss';
import { Button, Dropdown, Image, Table, Typography, message, Modal } from 'antd';
import CreateProductPopup from '../../popups/CreateProduct/CreateProductPopup';
import FormatMoney from '../../utils/FormatMoney';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import EditProductPopup from '../../popups/EditProduct/EditProductPopup';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { Api } from '../../models/api';
import { randomVector } from '../../utils/randomVector';
import ViewProductDrawer from '../../drawers/ViewProduct/ViewProductDrawer';

interface DatatablesViewProps {
	title: string;
	categoryId: number;
}

const { confirm } = Modal;

const DatatablesView: React.FC<DatatablesViewProps> = ({ title, categoryId }) => {
	const [listingData, setListingData] = useState<Api.Animal.Res.AnimalListing[]>([]);
	const [selectedAnimal, setSelectedAnimal] = useState<Api.Animal.Res.AnimalListing | null>(null);
	const [openCreateProduct, setOpenCreateProduct] = useState<boolean>(false);
	const [openEditProduct, setOpenEditProduct] = useState<boolean>(false);
	const [openViewProduct, setOpenViewProduct] = useState<boolean>(false);
	const [forceUpdate, setForceUpdate] = useState<boolean>(false);

	// Menu action functions
	const onViewProduct = () => {
		setOpenViewProduct(true);
	};

	const onEditProduct = () => {
		setOpenEditProduct(true);
	};

	const onDeleteProduct = () => {
		if (!selectedAnimal) return;
		confirm({
			title: 'Delete Product',
			content: 'Are you sure you want to delete this product?',
			centered: true,
			okText: 'Yes, delete',
			okType: "danger",
			okButtonProps: {
				type: 'primary'
			},
			async onOk() {
				try {
					const deleteProduct = await axios.delete(`${API_URL}/animals/${selectedAnimal.id}`)
					if (deleteProduct) {
						message.success(`Animal successfully deleted.`);
						setForceUpdate(!forceUpdate);
					}
				} catch (error) {
					message.error(`Something wen't wrong in deleting product.`)
				}
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
			onClick: onViewProduct
		},
		{
			key: '2',
			label: (
				<Typography.Text className="orderTableColCta">
					<i className="ri-edit-line"></i> Edit
				</Typography.Text>
			),
			onClick: onEditProduct
		},
		{
			key: '3',
			label: (
				<Typography.Text className="orderTableColCta">
					<i className="ri-delete-bin-line"></i> Delete
				</Typography.Text>
			),
			className: 'deleteCta',
			onClick: onDeleteProduct
		}
	];

	const columns: ColumnsType<Api.Animal.Res.AnimalListing> = [
		{
			title: 'Name',
			dataIndex: '',
			key: 'name',
			render: (data: Api.Animal.Res.AnimalListing) => {
				return (
					<div className="tableTitleContent">
						<Image
							src={require(`../../assets/images/vectors/${randomVector}.png`)}
						/>
						<div className="tableTitleBreederContent">
							<Typography.Text className="titleTxt">{data.name}</Typography.Text>
							<Typography.Text className="titleOwnerTxt">Age: {data.age}</Typography.Text>
						</div>
					</div>
				);
			},
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (age) => {
				return FormatMoney(age);
			},
		},
		{
			title: 'Bio',
			dataIndex: 'bio',
			key: 'bio',
			ellipsis: true
		},
		{
			title: '',
			dataIndex: '',
			key: '',
			render: (record) => (
				<Dropdown
					overlayClassName="ordersTableColCtaDropdown"
					trigger={['click']}
					menu={{ items }}
					onOpenChange={() => setSelectedAnimal(record)}
					placement="bottom"
					arrow={{ pointAtCenter: true }}
				>
					<Button className='menuItemCta' size="small">
						<i className="ri-more-2-line"></i>
					</Button>
				</Dropdown>
			),
		}
	];

	useEffect(() => {
		loadListings();
		// eslint-disable-next-line
	}, [categoryId, forceUpdate]);

	const loadListings = async () => {
		if (!categoryId) return;
		try {
			const res = (await axios.get(`${API_URL}/animals/listing/${categoryId}`)).data;
			setListingData(res);
		} catch (error) {
			message.error(`Something wen't wrong in getting data for datatable.`);
		}
	}

	return (
		<div className="datatableViewContainer">
			<div className="datatableViewHeader">
				<Typography.Title level={3} className="datatableViewHeaderTxt">
					{title ? title : `Datatables`}
				</Typography.Title>
				<Button onClick={() => setOpenCreateProduct(true)} type="primary">
					Create Product
				</Button>
			</div>
			<div className="datatableTableContainer">
				<Table columns={columns} dataSource={listingData} />
			</div>
			<CreateProductPopup
				opened={openCreateProduct}
				categoryId={categoryId}
				onCancel={() => setOpenCreateProduct(false)}
				onForceCb={() => setForceUpdate(!forceUpdate)}
			/>
			{selectedAnimal && <EditProductPopup
				opened={openEditProduct}
				animal={selectedAnimal}
				categoryId={categoryId}
				onCancel={() => setOpenEditProduct(false)}
				onForceCb={() => setForceUpdate(!forceUpdate)}
			/>}
			{selectedAnimal && <ViewProductDrawer
				opened={openViewProduct}
				animal={selectedAnimal}
				onCancel={() => setOpenViewProduct(false)}
				onForceCb={() => setForceUpdate(!forceUpdate)}
			/>}
		</div>
	);
};

export default DatatablesView;
