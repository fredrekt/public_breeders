import React, { useState } from 'react';
import './Registerpage.scss';
import PublicLayout from '../../layouts/public/PublicLayout';
import { Avatar, Col, Row, Space, Typography, Upload, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import breederAccountType from '../../assets/images/breeder.png';
import buyerAccountType from '../../assets/images/buyer.png';
import AccountTypeSelection from '../../components/AccountTypeSelection/AccountTypeSelection';
import axios from 'axios';
import { API_URL, BEARER } from '../../utils/constant';
import { Api } from '../../models/api';
import { getToken, setToken } from '../../utils/authHelpers';
import registerImg from '../../assets/images/mainHero.png';
import { Steps } from 'antd';
import type { UploadProps } from 'antd';
import { Model } from '../../models/model';

const Registerpage: React.FC = () => {
	const navigate = useNavigate();
	const [registrationStep, setRegistrationStep] = useState<number>(0);
	const [accountType, setAccountType] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [avatarImageLogo, setAvatarImageLogo] = useState<Model.Image>({
		url: '',
		id: 0
	});
	const [avatarImageCover, setAvatarImageCover] = useState<Model.Image>({
		url: '',
		id: 0
	});
	const [user, setUser] = useState<Api.User.Res.LoggedInUser>();

	const onRegister = async (values: any) => {
		if (!values) return;
		try {
			setIsLoading(true);
			let registerData: Api.User.Req.Create = {
				isBuyer: accountType === 1 ? true : false,
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username.split('@')[0],
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
				setUser(res.data.user);
				proceedNextStep();
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
		if (registrationStep !== 0) return;
		return (
			<Space className="accountTypeSelectionParentContainer" direction="vertical">
				<div className="accountTypesSelectionContainer">
					<AccountTypeSelection
						activeSetup={accountType}
						currentSetup={1}
						label={'User'}
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

	const onUpdateBreeder = async (values: any) => {
		if (!values || !user) return;
		if (!user.breeder) return;
		setIsLoading(true);
		try {
			let updateData = {
				data: values
			};
			const update = await axios.put(`${API_URL}/breeders/${user.breeder}`, updateData, {
				headers: {
					Authorization: `${BEARER} ${getToken()}`
				}
			});
			if (update) {
				setIsLoading(false);
				message.success(`Successfully updated breeder details.`);
				navigate(`/profile`);
			}
		} catch (error) {
			setIsLoading(false);
			message.error(`Something wen't wrong in onboarding a breeder account.`);
		}
	};

	const breederUploadPropsCoverPhoto: UploadProps = {
		name: 'files',
		action: `${API_URL}/upload`,
		data: {
			field: 'coverPhoto',
			ref: 'api::breeder.breeder',
			refId: user && user.breeder && user.breeder
		},
		accept: 'image/*',
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
					id: response[0].id,
					url: response[0].url
				};
				setAvatarImageCover(ImageRes);
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		}
	};

	const breederUploadPropsLogo: UploadProps = {
		name: 'files',
		action: `${API_URL}/upload`,
		data: {
			field: 'avatar',
			ref: 'api::breeder.breeder',
			refId: user && user.breeder && user.breeder
		},
		accept: 'image/*',
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
					id: response[0].id,
					url: response[0].url
				};
				setAvatarImageLogo(ImageRes);
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		}
	};

	return (
		<PublicLayout navbar className="registerPage">
			<Row gutter={[32, 32]} className="registerPageRow" align={'middle'}>
				<Col className="registerHeroCol" xs={0} sm={0} md={10} lg={10} xl={10} xxl={10}>
					<img src={registerImg} alt="register hero" className="registerHero" />
				</Col>
				<Col className="registerRightCol" xs={24} sm={24} md={14} lg={14} xl={14} xxl={14}>
					<div className={`registerCard ${registrationStep === 0 ? 'fixedHeight' : ''}`}>
						<Steps
							responsive={false}
							className="registerStepper"
							size="small"
							current={registrationStep}
							items={
								registrationStep !== 0 ? (accountType === 1 ? buyerSteps : breederSteps) : buyerSteps
							}
						/>
						{registrationStep === 0 && (
							<Typography.Title className="registerHeaderTitle" level={2}>
								Create your account
							</Typography.Title>
						)}
						{renderFirstRegistrationStep()}
						{registrationStep !== 0 && (
							<b className="registrationFormHeader">
								{accountType === 1 ? 'User' : 'Breeder'} Registration
							</b>
						)}
						{registrationStep === 1 && (
							<>
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
											<Form.Item name="">
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
												<Button className="addBreederCard">
													<i className="ri-upload-cloud-2-line"></i>Upload breeder card
												</Button>
											</Form.Item>
										</>
									)}

									<Form.Item>
										<Button
											disabled={isLoading}
											loading={isLoading}
											type="primary"
											htmlType="submit"
											className="registerCta"
										>
											Sign Up
										</Button>
									</Form.Item>
								</Form>
							</>
						)}
						{registrationStep === 2 && (
							<Form
								name="normal_login"
								layout="vertical"
								className="registerForm"
								initialValues={{ remember: true }}
								onFinish={onUpdateBreeder}
								size="large"
							>
								<Form.Item className="breederPhotoInputContainer" label="">
									<Space>
										<Upload {...breederUploadPropsCoverPhoto}>
											<Button className={`breederCoverPhoto ${avatarImageCover ? 'hasImg' : ''}`}>
												{avatarImageCover && avatarImageCover.url ? (
													<img className='breederCoverPhotoImg' src={avatarImageCover.url || registerImg} alt="breeder cover" />
												) : (
													<i className="ri-image-line ri-5x"></i>
												)}
											</Button>
										</Upload>
										<Upload {...breederUploadPropsLogo}>
											<Avatar
												size={75}
												shape="circle"
												className="clickable"
												icon={<i className="ri-image-line"></i>}
												src={avatarImageLogo ? avatarImageLogo.url : null}
											/>
										</Upload>
									</Space>
								</Form.Item>
								<Form.Item
									name="businessName"
									rules={[{ required: true, message: 'Please input your Business name!' }]}
								>
									<Input placeholder="Business name" />
								</Form.Item>
								<Form.Item
									name="businessAddress"
									rules={[{ required: true, message: 'Please input your Business location!' }]}
								>
									<Input placeholder="Business location" />
								</Form.Item>
								<Form.Item name="aboutBusiness" label="About your kennel">
									<Input.TextArea rows={5} placeholder="Tell us about your kennel" />
								</Form.Item>
								<Form.Item>
									<Button
										disabled={isLoading}
										loading={isLoading}
										type="primary"
										htmlType="submit"
										className="registerCta"
									>
										Submit
									</Button>
								</Form.Item>
							</Form>
						)}
					</div>
					<Typography.Paragraph className="registerSubTxt">
						It is free to sign up as a user, there is a fee of $129 to activate your breeders account
					</Typography.Paragraph>
				</Col>
			</Row>
		</PublicLayout>
	);
};

export default Registerpage;
