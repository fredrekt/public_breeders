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
import { getToken, removeToken, setToken } from '../../utils/authHelpers';
import registerImg from '../../assets/images/mainHero.png';
import { Steps } from 'antd';
import type { UploadProps } from 'antd';
import { Model } from '../../models/model';
import Tesseract from 'tesseract.js';

interface ParsedData {
	firstName: string;
	lastName: string;
	name: string;
	cardNumber: string;
	prefix: string;
	registryName: string;
}

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
	const [breederData, setBreederData] = useState({
		businessName: ''
	});
	const [parsedData, setParsedData] = useState<ParsedData>({
		firstName: '',
		lastName: '',
		name: '',
		cardNumber: '',
		prefix: '',
		registryName: ''
	});
	const [breederCardPhoto, setBreederCardPhoto] = useState<any>();

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
				let currentBusinessName: string = '';
				registerData.registryName = values.registryName;
				registerData.prefix = values.prefix;
				registerData.phone = values.phone;
				currentBusinessName = values.registryName;
				if (parsedData) {
					if (parsedData.firstName) {
						registerData.firstName = parsedData.firstName;
					}
					if (parsedData.lastName) {
						registerData.lastName = parsedData.lastName;
					}
					if (parsedData.prefix) {
						registerData.prefix = parsedData.prefix;
					}
					if (parsedData.registryName) {
						currentBusinessName = parsedData.registryName;
					}
				}
				setBreederData({
					businessName: currentBusinessName
				});
			}

			// register function
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
				data: {
					...values,
					onboarding_registration: true
				}
			};
			const update = await axios.put(`${API_URL}/breeders/${user.breeder.id}`, updateData, {
				headers: {
					Authorization: `${BEARER} ${getToken()}`
				}
			});
			if (breederCardPhoto && user && user.breeder) {
				const breederId: any = user.breeder.id;
				const formData = new FormData();
				formData.append('files', breederCardPhoto);
				formData.append('field', 'cardPhoto');
				formData.append('ref', 'api::breeder.breeder');
				formData.append('refId', breederId);

				await axios.post(`${API_URL}/upload`, formData, {
					headers: {
						Authorization: `${BEARER} ${getToken()}`,
						'Content-Type': 'multipart/form-data'
					}
				});
			}
			if (update) {
				setIsLoading(false);
				message.success(`Successfully updated breeder details.`);
				removeToken();
				navigate(`/pending-approval`);
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
			refId: user && user.breeder && user.breeder.id
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
			refId: user && user.breeder && user.breeder.id
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

	const parseTextToJSON = async (text: string): Promise<ParsedData> => {
		// Define the position marker for card number
		const cardNumberMarker = 'Member Number:';
		const cardNumberIndex = text.indexOf(cardNumberMarker);

		if (cardNumberIndex !== -1) {
			// Extract the text before the card number marker
			const textBeforeCardNumber = text.substring(0, cardNumberIndex);

			// Split the text before card number marker into lines
			const lines = textBeforeCardNumber.split('\n');

			// Find the last non-empty line, which likely contains the name
			let name = '';
			for (let i = lines.length - 1; i >= 0; i--) {
				const line = lines[i].trim();
				if (line.length > 0) {
					name = line;
					break;
				}
			}

			// Extract the card number and kennel prefix based on their marker positions
			const cardNumberMatch = text.match(/Member Number: (.+)/);
			const prefixMatch = text.match(/Kennel Prefix: (.+)/);

			const cardNumber = cardNumberMatch ? cardNumberMatch[1].trim() : '';
			const prefix = prefixMatch ? prefixMatch[1].trim() : '';
			const cleanedName = name.replace(/(^|\s)(.)(?=\s|$)/g, '');

			const parts = cleanedName.split(/\s+/);

			let firstName = '';
			let lastName = '';

			if (parts.length > 0) {
				firstName = parts[0];
				lastName = parts.slice(1).join(' ');
			}

			return { name: cleanedName, cardNumber, prefix, firstName, lastName, registryName: prefix };
		} else {
			// Card number marker not found
			return { name: '', cardNumber: '', prefix: '', firstName: '', lastName: '', registryName: '' };
		}
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsLoading(true);
		const imageFile = event.target.files?.[0];

		if (!imageFile) return;

		console.log(JSON.stringify(imageFile));

		// Process the image using Tesseract.js
		const { data } = await Tesseract.recognize(imageFile);
		const extractedText = data.text;

		// Parse extracted text and generate JSON
		console.log('extracted ocr text', extractedText);
		const parsedJson = await parseTextToJSON(extractedText);

		if (!parsedJson.name || !parsedJson.prefix) {
			message.error('Breeder card is invalid.');
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		setParsedData({ ...parsedData, ...parsedJson });
		setBreederCardPhoto(imageFile);
		message.success('Successfully uploaded breeder card.');
	};

	const handleInputChange = (e: any) => setParsedData({ ...parsedData, [e.target.name]: e.target.value });

	const { prefix, registryName } = parsedData;

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
									initialValues={parsedData}
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
											<Form.Item name="phone">
												<Input placeholder="Phone" />
											</Form.Item>
											<Form.Item
												name="registryName"
												rules={[
													{ required: true, message: 'Please input your Registry name!' }
												]}
											>
												<Input
													value={registryName}
													name="registryName"
													onChange={handleInputChange}
													placeholder="Enter Registry Name"
												/>
											</Form.Item>

											<Form.Item name="prefix">
												<Input
													value={prefix}
													name="prefix"
													onChange={handleInputChange}
													placeholder="Enter Prefix"
												/>
												<small className="prefixOptionalExtra">Prefix is optional</small>
											</Form.Item>

											<Form.Item>
												<label
													className={`custom-breeder-card-upload ${
														isLoading ? 'disabled' : ''
													}`}
												>
													<input
														type="file"
														accept="image/*"
														disabled={isLoading}
														onChange={handleImageUpload}
													/>
													<i className="ri-upload-cloud-2-line ri-lg"></i>Upload breeder card
												</label>
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
								initialValues={{ remember: true, ...breederData }}
								onFinish={onUpdateBreeder}
								size="large"
							>
								<Form.Item className="breederPhotoInputContainer" label="">
									<Space>
										<Upload {...breederUploadPropsCoverPhoto}>
											<Button className={`breederCoverPhoto ${avatarImageCover ? 'hasImg' : ''}`}>
												{avatarImageCover && avatarImageCover.url ? (
													<img
														className="breederCoverPhotoImg"
														src={avatarImageCover.url || registerImg}
														alt="breeder cover"
													/>
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
