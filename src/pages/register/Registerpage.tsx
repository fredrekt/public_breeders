import React, { useState } from 'react';
import './Registerpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Card, Col, Row, Space, Typography, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import breederAccountType from '../../assets/images/breeder.png';
import buyerAccountType from '../../assets/images/buyer.png';
import AccountTypeSelection from '../../components/AccountTypeSelection/AccountTypeSelection';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { Api } from '../../models/api';
import { setToken } from '../../utils/authHelpers';
import registerImg from '../../assets/images/onboarding_hero.png';
import { Steps } from 'antd';

const Registerpage: React.FC = () => {
	const navigate = useNavigate();
	const [registrationStep, setRegistrationStep] = useState<number>(1);
	const [accountType, setAccountType] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onRegister = async (values: any) => {
		if (!values) return;
		try {
			setIsLoading(true);
			let registerData: Api.User.Req.Create = {
				isBuyer: accountType === 1 ? true : false,
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username,
				email: values.username,
				password: values.password
			};
			if (accountType === 0) {
				registerData.registryName = values.registryName;
				registerData.prefix = values.prefix;
			}
			const res = await axios.post(
				`${API_URL}/auth/local/register?breeder=${registerData.isBuyer ? false : true}`,
				registerData
			);
			if (!res) return;
			setToken(res.data.jwt);
			message.success('Successfully created an account.');
			setIsLoading(false);
			if (!registerData.isBuyer) {
				navigate('/profile');
			} else {
				navigate('/');
			}
		} catch (err: any) {
			setIsLoading(false);
			const { error } = err.response.data;
			if (error.message) {
				message.error(error.message);
			} else {
				message.error(`Something wen't wrong in creating an account. `);
			}
		}
	};

	const proceedNextStep = () => {
		setRegistrationStep(registrationStep + 1);
	};

	const renderFirstRegistrationStep = () => {
		if (registrationStep !== 1) return;
		return (
			<Space className="accountTypeSelectionParentContainer" direction="vertical">
				<div className="accountTypesSelectionContainer">
					<AccountTypeSelection
						activeSetup={accountType}
						currentSetup={1}
						label={'Buyer'}
						imgSrc={buyerAccountType}
						onClick={(setup: number) => setAccountType(setup)}
					/>
					<AccountTypeSelection
						activeSetup={accountType}
						currentSetup={0}
						label={'Breeder'}
						imgSrc={breederAccountType}
						onClick={(setup: number) => setAccountType(setup)}
					/>
				</div>
				<Button type="dashed" onClick={proceedNextStep}>
					Next
				</Button>
			</Space>
		);
	};

	const buyerSteps = [
		{
			title: 'Step 1'
		},
		{
			title: 'Step 2'
		}
	];

	const breederSteps = [
		{
			title: 'Step 1'
		},
		{
			title: 'Step 2'
		},
		{
			title: 'Step 3'
		}
	];

	return (
		<PublicLayout navbar className="registerPage">
			<Row gutter={[32, 32]} className="registerPageRow" align={'middle'}>
				<Col md={12} lg={12} xl={12} xxl={12}>
					<img src={registerImg} alt="register hero" className="registerHero" />
				</Col>
				<Col md={12} lg={10} xl={10} xxl={10}>
					<Card className={`registerCard ${registrationStep === 1 ? 'fixedHeight' : ''}`}>
						<Steps
							className="registerStepper"
							size="small"
							current={registrationStep}
							items={registrationStep === 1 || accountType === 1 ? buyerSteps : breederSteps}
						/>
						<Typography.Title className="registerHeaderTitle" level={2}>
							Create your account
						</Typography.Title>
						{renderFirstRegistrationStep()}
						{registrationStep === 2 && (
							<>
								{registrationStep === 2 && (
									<b className="registrationFormHeader">
										{accountType === 1 ? 'Buyer' : 'Breeder'} Registration
									</b>
								)}
								<Form
									name="normal_login"
									className="registerForm"
									initialValues={{ remember: true }}
									onFinish={onRegister}
									size="large"
								>
									{accountType === 1 && (
										<>
											<Form.Item
												name="firstName"
												rules={[{ required: true, message: 'Please enter first name.' }]}
											>
												<Input placeholder="First Name" />
											</Form.Item>
											<Form.Item
												name="lastName"
												rules={[{ required: true, message: 'Please enter last name.' }]}
											>
												<Input placeholder="Last Name" />
											</Form.Item>
										</>
									)}

									<Form.Item
										name="username"
										rules={[{ required: true, message: 'Please enter your Username!' }]}
									>
										<Input type="email" placeholder="Emaill Address" />
									</Form.Item>

									<Form.Item
										name="password"
										rules={[
											{ required: true, message: 'Please enter your Password!' },
											{ min: 6, message: 'Password must be at least 6 characters.' }
										]}
									>
										<Input.Password type="password" placeholder="Password" />
									</Form.Item>

									{accountType === 0 && (
										<>
											<Form.Item
												name=""
											>
												<Input placeholder="Phone" />
											</Form.Item>
											<Form.Item
												name="registryName"
												rules={[
													{ required: true, message: 'Please input your Registry name!' }
												]}
											>
												<Input placeholder="Enter Registry Name" />
											</Form.Item>

											<Form.Item name="prefix">
												<Input placeholder="Enter Prefix" />
												<small className="prefixOptionalExtra">Prefix is optional</small>
											</Form.Item>

											<Form.Item>
												<Button className="addBreederCard"><i className="ri-upload-cloud-2-line"></i>Upload breeder card</Button>
											</Form.Item>
										</>
									)}

									<Form.Item>
										<Button disabled={isLoading} loading={isLoading} type="primary" htmlType="submit" className="registerCta">
											Sign Up
										</Button>
									</Form.Item>
								</Form>
							</>
						)}
					</Card>
					<Typography.Paragraph className="registerSubTxt">
						It is free to sign up as a buyer, there is a fee of $XX to activate your breeders account
					</Typography.Paragraph>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default Registerpage;
