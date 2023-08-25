import React, { useState } from 'react';
import { PopupModel } from '../../models/PopupModel';
import './CreateProductPopup.scss';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Typography, message } from 'antd';
import axios from 'axios';
import { API_URL, BEARER } from '../../utils/constant';
import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useUserContext } from '../../context/UserContext';
import { Api } from '../../models/api';
import { getToken } from '../../utils/authHelpers';

interface CreateProductPopupProps extends PopupModel {
	categoryId: number;
}

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const CreateProductPopup: React.FC<CreateProductPopupProps> = ({ opened, onCancel, onForceCb, categoryId }) => {
	const { user } = useUserContext();
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');
	const [previewTitle, setPreviewTitle] = useState<string>('');
	const [fileList, setFileList] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onCreate = async (values: any) => {
		if (!user) return;
		setIsLoading(true);
		try {
			let createData: Api.Animal.Req.Create = {
				...values
			};
			const createProduct = await axios.post(`${API_URL}/animals`, { data: createData });
			if ((createProduct.data && createProduct.data.id) && (Array.isArray(fileList) && fileList.length)) {
				let imageIds: number[] = [];
				for (let file of fileList) {
					if (!file.response) continue;
					imageIds.push(file.response[0].id);
				}
				if (Array.isArray(imageIds) && imageIds) {
					await axios.put(`${API_URL}/animals/${createProduct.data.id}`, {
						data: {
							images: imageIds
						}
					});
				}
			}
			message.success(`Successfully create a product.`);
			setIsLoading(false);
			onCancel();
			onForceCb();
		} catch (error) {
			setIsLoading(false);
			message.error(`Something wen't wrong in creating a product.`);
		}
	};

	const handleCancel = () => setPreviewOpen(false);
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

	const handleRemoveImage = async (file: any) => {
		if (!Array.isArray(fileList) || !fileList.length) return;
		let filteredImages = fileList.filter((data) => data.id !== file.id);
		setFileList(filteredImages);
	}

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	const closeWithReset = () => {
		setPreviewOpen(false);
		setPreviewImage('');
		setPreviewTitle('');
		setFileList([]);
	}

	return (
		<Modal
			className="createProductPopup"
			open={opened}
			onOk={onCreate}
			afterClose={closeWithReset}
			okButtonProps={{ htmlType: 'submit' }}
			onCancel={onCancel}
			okText="Create listing"
			centered closable={false}
			title={'Create Listing'}
			footer={null}
			destroyOnClose
		>
			<Form initialValues={{
				categories: categoryId
			}} className="createProductForm" onFinish={onCreate}>
				<Form.Item name="name">
					<Input placeholder="Name" />
				</Form.Item>
				<Form.Item name="categories">
					<Select
						placeholder="Type"
						options={[
							{ value: 3, label: 'Pup For Showcase' },
							{ value: 2, label: 'Pups For Sale' },
							{ value: 1, label: 'Stud Profile' },
							{ value: 4, label: 'Upcoming Litters' }
						]}
					/>
				</Form.Item>
				<Form.Item name="price">
					<InputNumber className='productPricing' precision={2} placeholder="Price" />
				</Form.Item>
				<Form.Item name="age">
					<Input placeholder="Age" />
				</Form.Item>
				<Form.Item name="bio">
					<Input.TextArea placeholder="Tell us about your listing" rows={5} />
				</Form.Item>
				<Form.Item name="images">
					<Typography.Paragraph>Images</Typography.Paragraph>
					<Upload
						name='files'
						method='POST'
						headers={{
							Authorization: `${BEARER} ${getToken()}`
						}}
						action={`${API_URL}/upload`}
						listType="picture-card"
						fileList={fileList}
						onPreview={handlePreview}
						onChange={handleChange}
						onRemove={handleRemoveImage}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
				</Form.Item>
				<Form.Item className="createProductCta">
					<Space className="createProductCtaSpace" align="center">
						{!isLoading && <Button onClick={onCancel}>Cancel</Button>}
						<Button disabled={isLoading} loading={isLoading} type="primary" htmlType="submit">
							{isLoading ? `Creating Listing...` : `Create Listing`}
						</Button>
					</Space>
				</Form.Item>
			</Form>
			<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
				<img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</Modal>
	);
};

export default CreateProductPopup;
