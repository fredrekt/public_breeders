import React from 'react';
import './ForgotPassword.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import axios from 'axios';
import { API_URL } from '../../utils/constant';

const ForgotPassword: React.FC = () => {
	const onSendResetLink = async (values: any) => {
		try {
			await axios.post(`${API_URL}/auth/forgot-password`, values)
			message.success(`Successfully sent a reset link.`);
		} catch (error) {
			message.error(`Something wen't wrong in sending forgot password email.`);
		}
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
						]} name="email">
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
