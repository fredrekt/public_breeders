import React from 'react';
import './SettingsView.scss';
import { Avatar, Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import { faker } from '@faker-js/faker';

const SettingsView: React.FC = () => {
	const [form] = Form.useForm();

	const onUpload = async () => {};

	return (
		<div className="settingsView">
			<Card className="settingsHeaderCard">
				<Row className="settingsHeader" gutter={[16, 16]} align={'middle'} justify={'space-between'}>
					<Col lg={20} className="settingsHeaderAvatar">
						<Avatar
							size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
							src={faker.image.avatar()}
							shape="circle"
						/>
						<div className="settingsHeaderInfo">
							<Typography.Title level={4}>{faker.person.fullName()}</Typography.Title>
							<Typography.Paragraph>Breeder</Typography.Paragraph>
						</div>
					</Col>
					<Col className="settingsHeaderCta" lg={4}>
						<Button onClick={onUpload}>Upload</Button>
					</Col>
				</Row>
			</Card>
			<Card className="settingsPersonalInfoCard">
				<Typography.Title className="settingsPersonalInfoHeaderTxt" level={4}>
					Personal Information
				</Typography.Title>
				<Form size="large" layout={'vertical'} form={form}>
					<Space className="twoFormCol" align="baseline">
						<Form.Item name={'firstName'}>
							<Input placeholder="First Name" />
						</Form.Item>
						<Form.Item name={'lastName'}>
							<Input placeholder="Last Name" />
						</Form.Item>
					</Space>
					<Form.Item label="Email">
						<Input placeholder="Enter email address" />
					</Form.Item>
					<Form.Item>
						<Button type="primary">Update Information</Button>
					</Form.Item>
				</Form>
			</Card>

			<Card className="settingsBusinessInfoCard">
				<Typography.Title className="settingsBusinessInfoHeaderTxt" level={4}>
					Business Information
				</Typography.Title>
				<Form size="large" layout={'vertical'} form={form}>
					<Form.Item label="">
						<Avatar
							size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
							src={faker.image.avatar()}
							shape="circle"
						/>
					</Form.Item>
					<Form.Item label="Business Name">
						<Input placeholder="Enter business name" />
					</Form.Item>
					<Form.Item label="Business Location">
						<Input placeholder="Enter business location" />
					</Form.Item>
					<Form.Item label="About your kennel">
						<Input.TextArea rows={5} placeholder="Tell us about your kennel" />
					</Form.Item>
					<Form.Item>
						<Button type="primary">Update Business Information</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default SettingsView;
