import React from 'react';
import './Loginpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Card, Col, Row, Space, Typography, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { setToken } from '../../utils/authHelpers';
import registerImg from '../../assets/images/onboarding_hero.png';

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
		<PublicLayout navbar className="loginPage">
			<Row gutter={[32, 32]} className="loginPageRow" align={'middle'}>
				<Col md={12} lg={12} xl={12} xxl={12}>
					<img src={registerImg} alt="login hero" className="loginHero" />
				</Col>
				<Col md={12} lg={10} xl={10} xxl={10}>
					<Card className="loginCard">
						<Typography.Title className='loginHeaderTitle' level={4}>Sign In</Typography.Title>
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
					</Card>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default Loginpage;
