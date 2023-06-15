import React, { useState } from 'react';
import './Registerpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Col, Row, Space, Typography, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import breederAccountType from '../../assets/images/breeder.png';
import buyerAccountType from '../../assets/images/buyer.png';
import AccountTypeSelection from '../../components/AccountTypeSelection/AccountTypeSelection';

const Registerpage: React.FC = () => {
	const [registrationStep, setRegistrationStep] = useState<number>(1);
	const [accountType, setAccountType] = useState<number>(1);

	const onRegister = async () => {
		try {
		} catch (error) {
			message.error(`Something wen't wrong in creating an account.`);
		}
	};

	const proceedNextStep = () => {
		setRegistrationStep(registrationStep + 1);
	};

	const renderFirstRegistrationStep = () => {
		if (registrationStep !== 1) return;
		return (
			<Space className="accountTypeSelectionParentContainer" direction="vertical">
				<Typography.Paragraph>Select account type</Typography.Paragraph>
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
				<Button type="primary" onClick={proceedNextStep}>
					Proceed
				</Button>
			</Space>
		);
	};

	return (
		<PublicLayout className="registerPage">
			<Row align={'middle'} justify={'center'}>
				<Col md={12} lg={6} xl={6} xxl={6}>
					<Typography.Title level={4}>Registration</Typography.Title>
					{renderFirstRegistrationStep()}
					{registrationStep === 2 && (
						<>
							<Form
								name="normal_login"
								className="registerForm"
								initialValues={{ remember: true }}
								onFinish={onRegister}
								size="large"
							>
								{accountType === 1 && (
									<Form.Item className="registerNameContainer">
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
									</Form.Item>
								)}

								<Form.Item
									name="username"
									rules={[{ required: true, message: 'Please input your Username!' }]}
								>
									<Input placeholder="Emaill Address" />
								</Form.Item>

								<Form.Item
									name="password"
									rules={[{ required: true, message: 'Please input your Password!' }]}
								>
									<Input.Password type="password" placeholder="Password" />
								</Form.Item>

								{accountType === 0 && (
									<>
										<Form.Item
											name="registryName"
											rules={[{ required: true, message: 'Please input your Registry name!' }]}
										>
											<Input placeholder="Enter Registry Name" />
										</Form.Item>

										<Form.Item name="prefix">
											<Input placeholder="Enter Prefix" />
											<small className="prefixOptionalExtra">Prefix is optional</small>
										</Form.Item>

										<Form.Item>
											<Button className="addBreederCard">Add Breeder ID Card</Button>
										</Form.Item>
									</>
								)}

								<Form.Item>
									<Button type="primary" htmlType="submit" className="registerCta">
										Sign Up
									</Button>
								</Form.Item>
							</Form>
							<Typography className="registerCtaText">
								Already have an account?
								<Link to="/login"> Login</Link>
							</Typography>
						</>
					)}
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default Registerpage;
