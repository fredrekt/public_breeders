import React, { useState } from 'react';
import './ForgotPassword.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { useNavigate, useParams } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSendResetLink = async (values: any) => {
		try {
			setIsLoading(true);
			await axios.post(`${API_URL}/auth/forgot-password`, values);
			setIsLoading(false);
			message.success(`Successfully sent a reset link.`);
		} catch (error) {
			setIsLoading(false);
			message.error(`Something wen't wrong in sending forgot password email.`);
		}
	};

	const onChangePassword = async (values: any) => {
		if (values.password !== values.passwordConfirmation) {
			message.error(`Passwords don't match.`);
			return;
		}
		try {
			let data = {
				...values,
				code: id
			};
			const res = (await axios.post(`${API_URL}/auth/reset-password`, data)).data;
			if (res) {
				setIsLoading(true);
				message.success(`Successfully changed your password.`);
				setTimeout(() => {
					navigate('/login');
				}, 800)
			} 
		} catch (error: any) {
			message.error(`Forgot password reset code is invalid.`);
			setIsLoading(false);
		}
	};

	return (
		<PublicLayout navbar className="forgotPasswordPage">
			<Row align={'middle'} justify={'center'}>
				<Col md={12} lg={6} xl={6} xxl={6}>
					<Typography.Title level={4}>{id ? `Change Password` : `Reset password`}</Typography.Title>
					<Typography.Paragraph>
						{id ? `Update your user password.` : `Send a reset link to your email.`}
					</Typography.Paragraph>
					<Form
						className="forgotPasswordForm"
						size="large"
						onFinish={id ? onChangePassword : onSendResetLink}
					>
						{id ? (
							<>
								<Form.Item rules={[
									{
										required: true,
										message: 'Please enter new password.'
									},
									{
										min: 6,
										message: 'Password must be atleast 6 characters.'
									}
								]} className='newPasswordInput' name="password">
									<Input.Password type="password" placeholder="New Password" />
								</Form.Item>
								<Form.Item rules={[
									{
										required: true,
										message: 'Please confirm new password.',
									},
									{
										min: 6,
										message: 'Password must be atleast 6 characters.'
									}
								]} required name="passwordConfirmation" className='newPasswordInput'>
									<Input.Password type="password" placeholder="Confirm Password" />
								</Form.Item>
							</>
						) : (
							<Form.Item
								rules={[
									{
										required: true,
										message: 'Please enter email.'
									}
								]}
								name="email"
							>
								<Input type="email" placeholder="Emaill Address" />
							</Form.Item>
						)}
						{id ? <Typography.Text className='resendResetCode'>Code not working? <a href="#resetCode" onClick={() => navigate('/forgot-password')}>Resend reset code</a>.</Typography.Text> : null}
						<Form.Item>
							<Button
								loading={isLoading}
								disabled={isLoading}
								type="primary"
								htmlType="submit"
								className="forgotPasswordCta"
							>
								{id ? `Change Password` : `Send Link`}
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default ForgotPassword;
