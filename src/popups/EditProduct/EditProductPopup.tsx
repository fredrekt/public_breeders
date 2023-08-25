import React, { useEffect, useState } from 'react';
import { PopupModel } from '../../models/PopupModel';
import './EditProductPopup.scss';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Typography, message } from 'antd';
import axios from 'axios';
import { API_URL, BEARER } from '../../utils/constant';
import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Api } from '../../models/api';
import { getToken } from '../../utils/authHelpers';

interface EditProductPopupProps extends PopupModel {
	animal: Api.Animal.Res.AnimalListing;
	categoryId: number;
}

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const EditProductPopup: React.FC<EditProductPopupProps> = ({ opened, onCancel, onForceCb, animal, categoryId }) => {
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');
	const [previewTitle, setPreviewTitle] = useState<string>('');
	const [fileList, setFileList] = useState<any[]>([]);
	const [fileListRemove, setFileListRemove] = useState<any[]>([]);

	const onUpdate = async (values: any) => {
		if (!animal) return;
		try {
			let imageIds: number[] = [];
			for (let file of fileList) {
				if (file.response) {
					imageIds.push(file.response[0].id);
				} else if (file.hasOwnProperty('url') && file.hasOwnProperty('id')) {
					imageIds.push(file.id);
				}
			}
			for (let file of fileListRemove) {
				if (!file.id) continue;
				imageIds.push(file.id);
			}
			let updateData = {
				data: {
					...values,
				}
			};
			updateData.data.images = imageIds;
			await axios.put(`${API_URL}/animals/${animal.id}`, updateData);
			message.success(`Animal successfully updated.`);
			onCancel();
			onForceCb();
		} catch (error) {
			message.error(`Something wen't wrong in updating a product.`);
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

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList}) => {
		setFileList(newFileList);
		if (Array.isArray(newFileList) && newFileList.length) {
			if (newFileList[0].status === 'done') {
				message.success('Message uploaded successfully.')
			}
		}
	}

	const handleRemoveImage = async (file: any) => {
		if (!Array.isArray(fileList) || !fileList.length) return;
		let filteredImages = fileList.filter((data) => data.id !== file.id);
		setFileListRemove(filteredImages);
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
	};

	useEffect(() => {
		const loadInitValues = () => {
			if (!animal) return;
			if (!Array.isArray(animal.images) || !animal.images.length) return;
			setFileList(animal.images);
		}
		loadInitValues();
	}, [opened, animal]);

	return (
		<Modal
			className="editProductPopup"
			open={opened}
			onOk={onUpdate}
			afterClose={closeWithReset}
			okButtonProps={{ htmlType: 'submit' }}
			onCancel={onCancel}
			okText="Update product"
			centered
			closable={false}
			title={'Edit Product'}
			footer={null}
			destroyOnClose
		>
			<Form initialValues={{ ...animal, categories: categoryId }} className="editProductForm" onFinish={onUpdate}>
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
					<InputNumber disabled className='productPricing' precision={2} placeholder="Price" />
				</Form.Item>
				<Form.Item name="age">
					<Input placeholder="Age" />
				</Form.Item>
				<Form.Item name="bio">
					<Input.TextArea placeholder="Tell us about your listing" rows={5} />
				</Form.Item>
				<Form.Item>
					<Typography.Paragraph>Images</Typography.Paragraph>
					<Upload
						action={`${API_URL}/upload`}
						method='POST'
						name="files"
						accept='image/*'
						headers={{
							Authorization: `${BEARER} ${getToken()}`
						}}
						listType="picture-card"
						fileList={fileList}
						onPreview={handlePreview}
						onChange={handleChange}
						onRemove={handleRemoveImage}
					>
						{fileList.length >= 8 ? null : uploadButton}
					</Upload>
				</Form.Item>
				<Form.Item className="editProductCta">
					<Space className="editProductCtaSpace" align="center">
						<Button htmlType="button" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="primary" htmlType="submit">
							Update Product
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

export default EditProductPopup;
