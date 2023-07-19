import React from 'react';
import './Loginpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Col, Row, Space, Typography, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { setToken } from '../../utils/authHelpers';

const Loginpage: React.FC = () => {
	const navigate = useNavigate();

	const onLogin = async (values: any) => {
		try {
			const res = await axios.post(`${API_URL}/auth/local`, values);
			if (!res) return;
			setToken(res.data.jwt);
			message.success(`Successfully logged in.`);
			navigate('/');
		} catch (error) {
			message.error(`Wrong password/username.`);
		}
	};

	return (
		<PublicLayout noFooter className="loginPage">
			<Row align={'middle'} justify={'center'}>
				<Col md={12} lg={6} xl={6} xxl={6}>
					<Typography.Title level={4}>Login</Typography.Title>
					<Form
						name="normal_login"
						className="loginForm"
						initialValues={{ remember: true }}
						onFinish={onLogin}
						size="large"
					>
						<Form.Item name="identifier">
							<Input placeholder="Emaill Address" />
						</Form.Item>
						<Form.Item name="password">
							<Input.Password type="password" placeholder="Password" />
						</Form.Item>
						<Form.Item>
							<Space className="loginHelpersContainer" align="center">
								<Typography.Paragraph className="forgotPasswordCta">
									Forgot password?
									<Link to="/forgot-password">Reset</Link>
								</Typography.Paragraph>
							</Space>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" className="loginCta">
								Login
							</Button>
						</Form.Item>
					</Form>
					<Typography className="loginRegisterCta">
						Don't have an account?
						<Link to="/register"> Register</Link>
					</Typography>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default Loginpage;
