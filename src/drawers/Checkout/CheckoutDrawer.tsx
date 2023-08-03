import React, { useEffect, useState } from 'react';
import './CheckoutDrawer.scss';
import { DrawerModel } from '../../models/DrawerModel';
import { Button, Card, Drawer, Input, Result, Space, Steps, Typography, message, Modal } from 'antd';
import dogImg from '../../assets/images/register.png';
import { Api } from '../../models/api';
import { randomVector } from '../../utils/randomVector';
import FormatMoney from '../../utils/FormatMoney';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { API_URL } from '../../utils/constant';

interface CheckoutDrawerProps extends DrawerModel {
	animal: Api.Animal.Res.AnimalListing | null;
}

const { confirm } = Modal;

const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({ opened, onCancel, onForceCb, animal }) => {
	const { user } = useUserContext();
	const [current, setCurrent] = useState<number>(0);
	const [contactFields, setContactFields] = useState({
		email: '',
		firstName: '',
		lastName: '',
		phoneNumber: ''
	});
	const [addressFields, setAddressFields] = useState({
		addressLine1: '',
		addressCity: '',
		addressState: '',
		addressUnitNumber: '',
		addressPostalCode: ''
	});
	const [errorAddressFields, setErrorAddressFields] = useState<boolean>(false);
	const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

	const onChangeContactFields = (e: any) => setContactFields({ ...contactFields, [e.target.name]: e.target.value });
	const onChangeAddressFields = (e: any) => setAddressFields({ ...addressFields, [e.target.name]: e.target.value });

	const { email, firstName, lastName, phoneNumber } = contactFields;

	const { addressLine1, addressCity, addressState, addressUnitNumber, addressPostalCode } = addressFields;

	const renderAnimalDetails = () => {
		if (!animal) return;
		return (
			<Card className="checkoutAnimalCard">
				<div className="checkoutAnimalInfoContainer">
					<img src={Array.isArray(animal.images) && animal.images.length ? animal.images[0].url : require(`../../assets/images/vectors/${randomVector}.png`)} alt="animal preview" />
					<div className="orderTitleBreederContent">
						<Typography.Text className="orderTitleTxt">{animal.name}</Typography.Text>
						<Typography.Text className="orderTitleOwnerTxt">{FormatMoney(animal.price)}</Typography.Text>
					</div>
				</div>
			</Card>
		);
	};

	const steps = [
		{
			title: 'Contact Details',
			content: () => {
				return (
					<div className="checkoutOrderForm">
						<Space className="checkoutOrderFormItemCol">
							<Input
								name="firstName"
								value={firstName}
								onChange={onChangeContactFields}
								size="large"
								placeholder="First Name"
							/>
							<Input
								name="lastName"
								value={lastName}
								onChange={onChangeContactFields}
								size="large"
								placeholder="Last Name"
							/>
						</Space>
						<Input
							name="email"
							value={email}
							onChange={onChangeContactFields}
							size="large"
							type="email"
							placeholder="Emaill Address"
						/>
						<Input
							name="phoneNumber"
							value={phoneNumber}
							onChange={onChangeContactFields}
							size="large"
							type="phone"
							placeholder="Phone Number (optional)"
						/>
					</div>
				);
			}
		},
		{
			title: 'Shipping Details',
			content: () => {
				return (
					<div className="checkoutOrderForm">
						<Input
							status={errorAddressFields && !addressUnitNumber ? 'error' : ''}
							name="addressUnitNumber"
							value={addressUnitNumber}
							onChange={onChangeAddressFields}
							size="large"
							placeholder="Unit / Apartment / House Number"
						/>
						<Input
							status={errorAddressFields && !addressLine1 ? 'error' : ''}
							name="addressLine1"
							value={addressLine1}
							onChange={onChangeAddressFields}
							size="large"
							placeholder="Address Line 1"
						/>
						<Input
							status={errorAddressFields && !addressCity ? 'error' : ''}
							name="addressCity"
							value={addressCity}
							onChange={onChangeAddressFields}
							size="large"
							placeholder="City"
						/>
						<Input
							status={errorAddressFields && !addressState ? 'error' : ''}
							name="addressState"
							value={addressState}
							onChange={onChangeAddressFields}
							size="large"
							placeholder="State"
						/>
						<Input
							status={errorAddressFields && !addressPostalCode ? 'error' : ''}
							name="addressPostalCode"
							value={addressPostalCode}
							onChange={onChangeAddressFields}
							size="large"
							placeholder="Postal Code"
						/>
					</div>
				);
			}
		},
		{
			title: 'Payment',
			content: () => {
				return (
					<>
						<Result
							icon={<img src={dogImg} alt="stripe checkout" />}
							title="Stripe Payment"
							subTitle="Please enter payment details to place order."
						/>
					</>
				);
			}
		}
	];

	const items = steps.map((item) => ({ key: item.title, title: item.title }));

	const validateShippingFields = () => {
		if (addressLine1 && addressCity && addressState && addressUnitNumber && addressPostalCode) {
			setErrorAddressFields(false);
			return true;
		}
		setErrorAddressFields(true);
		message.error(`Must fill up required fields`);
		return false;
	};

	const next = () => {
		if (current === 1 && !validateShippingFields()) {
			return;
		}
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const resetFields = () => {
		setCurrent(0);
		setContactFields({
			email: '',
			firstName: '',
			lastName: '',
			phoneNumber: ''
		});
		setAddressFields({
			addressLine1: '',
			addressCity: '',
			addressState: '',
			addressUnitNumber: '',
			addressPostalCode: ''
		});
		setPaymentProcessing(false);
	};

	const onCreateOrder = async () => {
		if (!animal || !user) return;
		setPaymentProcessing(true);
		if (animal.stripePaymentLink) {
			window.open(animal.stripePaymentLink, '_blank');
			return;
		}
		try {
			const createOrder = await axios.post(`${API_URL}/orders`, {
				data: {
					ordered_by: user.id,
					breeder: animal.breeder.id,
					animal: animal.id,
					...addressFields,
					phoneNumber
				}
			});
			if (createOrder) {
				message.success('Successfully placed order.');
				onForceCb();
				onCancel();
				resetFields();
			}
		} catch (error) {
			message.error(`Something wen't wrong in `);
		}
	};

	const onCancelPayment = () => {
		confirm({
			title: 'Are you sure you want to abandon this transaction?',
			content: 'Closing this popup before the transaction is complete is not reversible.',
			centered: true,
			onOk() {
				onCancel();
				resetFields();
				console.log('OK');
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	const loadInitValues = () => {
		if (!user) return;
		setContactFields({
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: ''
		});
	};

	useEffect(() => {
		loadInitValues();
		// eslint-disable-next-line
	}, [user]);

	return (
		<Drawer
			className="checkoutDrawer"
			title={`Checkout`}
			open={opened}
			onClose={paymentProcessing ? onCancelPayment : onCancel}
			placement="right"
			width={625}
			closable={paymentProcessing}
		>
			{renderAnimalDetails()}
			<div className="checkoutFormContainer">
				<Steps className="checkoutFormStepper" current={current} items={items} />
				{steps[current].content()}
			</div>
			<div className="checkoutCta">
				{current > 0 && !paymentProcessing && (
					<Button disabled={paymentProcessing} htmlType="button" onClick={() => prev()}>
						Previous
					</Button>
				)}
				{current < steps.length - 1 && (
					<Button htmlType="button" type="primary" onClick={() => next()}>
						Next
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button loading={paymentProcessing} disabled={paymentProcessing} onClick={onCreateOrder} htmlType="submit" type="primary">
						{paymentProcessing ? `Processing` : `Checkout`}
					</Button>
				)}
			</div>
		</Drawer>
	);
};

export default CheckoutDrawer;
