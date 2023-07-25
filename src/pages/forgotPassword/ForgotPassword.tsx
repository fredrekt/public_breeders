import React from 'react';
import './ForgotPassword.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';

const ForgotPassword: React.FC = () => {
	const onSendResetLink = async (values: any) => {
		message.success(`Successfully sent a reset link.`);
	};

	return (
		<PublicLayout navbar className="forgotPasswordPage">
			<Row align={'middle'} justify={'center'}>
				<Col md={12} lg={6} xl={6} xxl={6}>
					<Typography.Title level={4}>Reset password</Typography.Title>
					<Typography.Paragraph>Send a reset link to your email.</Typography.Paragraph>
					<Form className="forgotPasswordForm" size="large" onFinish={onSendResetLink}>
						<Form.Item rules={[
							{
								required: true,
								message: 'Please enter email.'
							}
						]} name="identifier">
							<Input type='email' placeholder="Emaill Address" />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" className="forgotPasswordCta">
								Send Link
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default ForgotPassword;
