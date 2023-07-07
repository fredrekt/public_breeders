import React, { useEffect, useState } from 'react';
import './CheckoutDrawer.scss';
import { DrawerModel } from '../../models/DrawerModel';
import { Button, Card, Drawer, Input, Result, Space, Steps, Typography, message } from 'antd';
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
		addressPostalCode: '',
	});

	const onChangeContactFields = (e: any) => setContactFields({ ...contactFields, [e.target.name]: e.target.value });
	const onChangeAddressFields = (e: any) => setAddressFields({ ...addressFields, [e.target.name]: e.target.value });
	
	const {
		email,
		firstName,
		lastName,
		phoneNumber
	} = contactFields;

	const {
		addressLine1,
		addressCity,
		addressState,
		addressUnitNumber,
		addressPostalCode,
	} = addressFields;

	const renderAnimalDetails = () => {
		if (!animal) return;
		return (
			<Card className="checkoutAnimalCard">
				<div className="checkoutAnimalInfoContainer">
					<img src={require(`../../assets/images/vectors/${randomVector}.png`)} alt="animal preview" />
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
					<div className='checkoutOrderForm'>
						<Space className='checkoutOrderFormItemCol'>
							<Input name="firstName" value={firstName} onChange={onChangeContactFields} size="large" placeholder="First Name" />
							<Input name="lastName" value={lastName} onChange={onChangeContactFields} size="large" placeholder="Last Name" />
						</Space>
						<Input name="email" value={email} onChange={onChangeContactFields} size="large" type="email" placeholder="Emaill Address" />
						<Input name="phoneNumber" value={phoneNumber} onChange={onChangeContactFields} size="large" type="phone" placeholder="Phone Number" />
					</div>
				);
			}
		},
		{
			title: 'Shipping Details',
			content: () => {
				return (
					<div className='checkoutOrderForm'>
						<Input name="addressUnitNumber" value={addressUnitNumber} onChange={onChangeAddressFields} size="large" placeholder="Unit / Apartment / House Number" />
						<Input name="addressLine1" value={addressLine1} onChange={onChangeAddressFields} size="large" placeholder="Address Line 1" />
						<Input name="addressCity" value={addressCity} onChange={onChangeAddressFields} size="large" placeholder="City" />
						<Input name="addressState" value={addressState} onChange={onChangeAddressFields} size="large" placeholder="State" />
						<Input name="addressPostalCode" value={addressPostalCode} onChange={onChangeAddressFields} size="large" placeholder="Postal Code" />
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
							icon={<img src={dogImg} alt="missing" />}
							title="In progress"
							subTitle="Stripe checkout functionality is still in progress."
						/>
					</>
				);
			}
		}
	];

	const items = steps.map((item) => ({ key: item.title, title: item.title }));

	const next = () => {
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const resetFields = () =>{
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
			addressPostalCode: '',
		});
	}
 
	const onCreateOrder = async () => {
		if (!animal || !user) return;
		try {
			const createOrder = await axios.post(`${API_URL}/orders`, {
				data: {
					ordered_by: user.id,
					breeder: animal.breeder.id,
					animal: animal.id,
					...addressFields,

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

	const loadInitValues = () => {
		if (!user) return;
		setContactFields({
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: ''
		})
	}

	useEffect(() => {
		loadInitValues();
		// eslint-disable-next-line
	}, [user]);

	return (
		<Drawer
			className="checkoutDrawer"
			title={`Checkout`}
			open={opened}
			onClose={onCancel}
			placement="right"
			width={625}
		>
			{renderAnimalDetails()}
			<div className="checkoutFormContainer">
				<Steps className='checkoutFormStepper' current={current} items={items} />
				{steps[current].content()}
			</div>
			<div className="checkoutCta">
				{current > 0 && (
					<Button htmlType="button" onClick={() => prev()}>
						Previous
					</Button>
				)}
				{current < steps.length - 1 && (
					<Button htmlType="button" type="primary" onClick={() => next()}>
						Next
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button onClick={onCreateOrder} htmlType="submit" type="primary">
						Checkout
					</Button>
				)}
			</div>
		</Drawer>
	);
};

export default CheckoutDrawer;