import React from 'react';
import './SettingsView.scss';
import { Avatar, Button, Card, Col, Form, Input, Row, Space, Typography, Upload, message } from 'antd';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { API_URL, BEARER } from '../../utils/constant';
import { randomVector } from '../../utils/randomVector';
import type { UploadProps } from 'antd';
import { getToken } from '../../utils/authHelpers';
import { Model } from '../../models/model';

const SettingsView: React.FC = () => {
	const [form] = Form.useForm();
	const { user, isLoading, setUser } = useUserContext();

	if (!user || isLoading) return <p>loading</p>;

	const onUpdateInformation = async (values: any) => {
		if (!user.id || !user) return;
		try {
			const update = await axios.put(`${API_URL}/users/${user.id}`, values);
			if (update.data) {
				setUser(update.data);
				message.success(`Successfully updated personal details.`);
			}
		} catch (error) {
			message.error(`Something wen't wrong in updating your personal details.`);
		}
	};

	const onUpdateBreederInformation = async (values: any) => {
		if (!user.id || !user) return;
		if (!user.breeder) return;
		try {
			let updateData = {
				data: values
			};
			const update = await axios.put(`${API_URL}/breeders/${user.breeder.id}`, updateData);
			if (update.data) {
				setUser({ ...user, ...update.data });
				message.success(`Successfully updated breeder details.`);
			}
		} catch (error) {
			message.error(`Something wen't wrong in updating your breeder details.`);
		}
	};

	const userUploadProps: UploadProps = {
		name: 'files',
		action: `${API_URL}/upload`,
		data: {
			field: 'avatar',
			ref: 'plugin::users-permissions.user',
			refId: user && user.id
		},
		method: 'POST',
		headers: {
			Authorization: `${BEARER} ${getToken()}`
		},
		async onChange(info) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				const { response } = info.file;
				if (!response) return;
				let ImageRes: Model.Image = {
					url: response[0].url
				};
				setUser({ ...user, avatar: ImageRes });
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		}
	};

	const breederUploadProps: UploadProps = {
		name: 'files',
		action: `${API_URL}/upload`,
		data: {
			field: 'avatar',
			ref: 'api::breeder.breeder',
			refId: user && user.breeder && user.breeder.id
		},
		method: 'POST',
		headers: {
			Authorization: `${BEARER} ${getToken()}`
		},
		async onChange(info) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				const { response } = info.file;
				if (!response) return;
				let ImageRes: Model.Image = {
					url: response[0].url
				};
				setUser({ ...user, breeder: {
					...user.breeder,
					avatar: ImageRes
				}});
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		}
	};

	return (
		<div className="settingsView">
			<Card className="settingsHeaderCard">
				<Row className="settingsHeader" gutter={[16, 16]} align={'middle'} justify={'space-between'}>
					<Col lg={20} className="settingsHeaderAvatar">
						<Avatar
							size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
							src={
								user.avatar
									? user.avatar.url
									: require(`../../assets/images/vectors/${randomVector}.png`)
							}
							shape="circle"
						/>
						<div className="settingsHeaderInfo">
							<Typography.Title level={4}>{`${user.firstName ? user.firstName : 'First'} ${
								user.lastName ? user.lastName : 'Last'
							}`}</Typography.Title>
							<Typography.Paragraph>{user.isBuyer ? `Buyer` : `Breeder`}</Typography.Paragraph>
						</div>
					</Col>
					<Col className="settingsHeaderCta" lg={4}>
						<Upload {...userUploadProps}>
							<Button>Upload</Button>
						</Upload>
					</Col>
				</Row>
			</Card>
			<Card className="settingsPersonalInfoCard">
				<Typography.Title className="settingsPersonalInfoHeaderTxt" level={4}>
					Personal Information
				</Typography.Title>
				<Form initialValues={user} size="large" layout={'vertical'} onFinish={onUpdateInformation}>
					<Space className="twoFormCol" align="baseline">
						<Form.Item name={'firstName'}>
							<Input placeholder="First Name" />
						</Form.Item>
						<Form.Item name={'lastName'}>
							<Input placeholder="Last Name" />
						</Form.Item>
					</Space>
					<Form.Item name="email" label="Email">
						<Input placeholder="Enter email address" />
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit" type="primary">
							Update Information
						</Button>
					</Form.Item>
				</Form>
			</Card>

			{!user.isBuyer && (
				<Card className="settingsBusinessInfoCard">
					<Typography.Title className="settingsBusinessInfoHeaderTxt" level={4}>
						Business Information
					</Typography.Title>
					<Form
						initialValues={user.breeder}
						size="large"
						layout={'vertical'}
						form={form}
						onFinish={onUpdateBreederInformation}
					>
						<Form.Item label="">
							<Avatar
								size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
								src={
									user.breeder.avatar
										? user.breeder.avatar.url
										: require(`../../assets/images/vectors/${randomVector}.png`)
								}
								shape="circle"
							/>
							<Upload {...breederUploadProps}>
								<Button>Upload</Button>
							</Upload>
						</Form.Item>
						<Form.Item name="businessName" label="Business Name">
							<Input placeholder="Enter business name" />
						</Form.Item>
						<Form.Item name="businessAddress" label="Business Location">
							<Input placeholder="Enter business location" />
						</Form.Item>
						<Form.Item name="aboutBusiness" label="About your kennel">
							<Input.TextArea rows={5} placeholder="Tell us about your kennel" />
						</Form.Item>
						<Form.Item>
							<Button htmlType="submit" type="primary">
								Update Business Information
							</Button>
						</Form.Item>
					</Form>
				</Card>
			)}
		</div>
	);
};

export default SettingsView;
