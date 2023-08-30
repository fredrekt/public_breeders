import React, { useState } from 'react';
import './Loginpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Col, Row, Space, Typography, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { setToken } from '../../utils/authHelpers';
import registerImg from '../../assets/images/mainHero.png';
import loginImg from '../../assets/images/login.svg';

const Loginpage: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const onLogin = async (values: any) => {
		setIsLoading(true);
		try {
			const res = await axios.post(`${API_URL}/auth/local`, values);
			if (!res) return;
			setIsLoading(false);
			if (!res.data.user.isBuyer && res.data.user.breeder && !res.data.user.breeder.isVerified) {
				navigate(`/pending-approval`)
				return;
			}
			setToken(res.data.jwt);
			message.success(`Successfully logged in.`);
			navigate('/');
		} catch (error) {
			setIsLoading(false);
			message.error(`Wrong password/username.`);
		}
	};

	return (
		<PublicLayout navbar className="loginPage">
			<Row gutter={[32, 32]} className="loginPageRow" align={'middle'}>
				<Col className="loginHero" xs={0} sm={0} md={10} lg={10} xl={10} xxl={10}>
					<img src={registerImg} alt="login hero" className="loginHero" />
				</Col>
				<Col className='loginRightCol' xs={24} sm={24} md={14} lg={14} xl={14} xxl={14}>
					<div className="loginCard">
						<img className='loginIcon' src={loginImg} alt="login icon" />
						<Typography.Title className='loginHeaderTitle' level={4}>Log In</Typography.Title>
						<Form
							name="normal_login"
							className="loginForm"
							initialValues={{ remember: true }}
							onFinish={onLogin}
							size="large"
						>
							<Form.Item name="identifier">
								<Input placeholder="Email Address" />
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
								<Button disabled={isLoading} loading={isLoading} type="primary" htmlType="submit" className="loginCta">
									Login
								</Button>
							</Form.Item>
						</Form>
						<Typography className="loginRegisterCta">
							Don't have an account?
							<Link to="/register"> Register</Link>
						</Typography>
					</div>
					<Typography.Paragraph className="registerSubTxt">
						It is free to sign up as a user, there is a fee of $129 to activate your breeders account
					</Typography.Paragraph>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default Loginpage;
