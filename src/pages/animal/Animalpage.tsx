import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Button, Col, Empty, Row, Typography, message } from 'antd';
import BreederDocumentCard from '../../components/BreederDocumentCard/BreederDocumentCard';
import ImageGallery from 'react-image-gallery';
import './Animalpage.scss';
import FormatMoney from '../../utils/FormatMoney';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useCopyToClipboard } from 'usehooks-ts';
import AnimalBreederInfo from '../../components/AnimalBreederInfo/AnimalBreederInfo';
import ContactBreederPopup from '../../popups/ContactBreeder/ContactBreederPopup';
import CheckoutDrawer from '../../drawers/Checkout/CheckoutDrawer';
import { Api } from '../../models/api';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../utils/constant';
import axios from 'axios';
import {
	FacebookShareButton,
	PinterestShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton
} from 'react-share';
import { useUserContext } from '../../context/UserContext';
import { randomVector } from '../../utils/randomVector';

const Animalpage: React.FC = () => {
	const { user } = useUserContext();
	const { id } = useParams();
	const [saved, setSaved] = useState<boolean>(false);
	const [value, copy] = useCopyToClipboard();
	const [openContactBreeder, setOpenContactBreeder] = useState<boolean>(false);
	const [openCheckout, setOpenCheckout] = useState<boolean>(false);
	const [animalData, setAnimalData] = useState<Api.Animal.Res.AnimalListing | null>(null);
	const [images, setImages] = useState<any[]>([]);
	const [favoriteIdHook, setFavoriteIdHook] = useState<number>(0);

	const imageGalleryProps = {
		showNav: false,
		showPlayButton: false,
		showFullscreenButton: false
	};

	const onChange = (key: string) => {
		console.log(key);
	};

	const onSave = async () => {
		if (!id) return;
		if (!user) return;
		try {
			const saveAnimal = await axios.post(`${API_URL}/favorites`, {
				data: {
					animal: id,
					user: user.id
				}
			});
			if (saveAnimal) {
				message.success('Successfully added to favorites.');
				setSaved(!saved);
			}
		} catch (error) {
			message.error(`Failed to add to saved list.`);
		}
	};

	const onUnsave = async () => {
		if (!id || !favoriteIdHook) return;
		if (!user) return;
		try {
			const unFavoriteAnimal = await axios.delete(`${API_URL}/favorites/${favoriteIdHook}`);
			if (unFavoriteAnimal) {
				message.success('Successfully removed to favorites.');
				setSaved(!saved);
			}
		} catch (error) {
			message.error(`Failed to remove to saved list.`)
		}
	}

	const onContactBreeder = () => {
		setOpenContactBreeder(true);
	};

	const onBuy = async () => {
		setOpenCheckout(true);
	};

	const onCopyToClipboard = () => {
		copy(window.location.href);
		console.log('copied link ', value);
		message.success('Successfully copied to clipboard.');
	};

	const loadAnimalData = async () => {
		if (!id) return;
		try {
			const res = (await axios.get(`${API_URL}/animals/${id}?populate=deep,3`)).data;
			if (res.data) {
				setAnimalData(res.data);
				if (Array.isArray(res.data.images) && res.data.images.length) {
					setImages(
						res.data.images.map((data: any) => ({
							thumbnailClass: 'thumbnailAnimalGallery',
							original: data.url,
							thumbnail: data.formats ? data.formats.thumbnail.url : data.url
						}))
					);
				} else {
					setImages([
						{
							thumbnailClass: 'thumbnailAnimalGallery',
							original: require(`../../assets/images/vectors/${randomVector}.png`),
							thumbnail: require(`../../assets/images/vectors/${randomVector}.png`)
						}
					]);
				}
			}
		} catch (error) {
			message.error(`Something wen't wrong in getting breeder details.`);
		}
	};

	useEffect(() => {
		loadAnimalData();
		// eslint-disable-next-line
	}, [id]);

	useEffect(() => {
		const loadInitValues = () => {
			const cleanedId: any = id;
			if (!user) return;
			if (!Array.isArray(user.favorites) || !user.favorites.length) return;
			setSaved(user.favorites.some((e) => e.animal.id === parseInt(cleanedId)));
			let filteredFavorite = user.favorites.filter(e => e.animal.id.toString()  === id);
			if (!Array.isArray(filteredFavorite) || !filteredFavorite.length) return;
			setFavoriteIdHook(filteredFavorite[0].id);
		};
		loadInitValues();
		// eslint-disable-next-line
	}, [user, id]);

	const renderAnimalDetails = () => {
		let categoryName: string = '';
		if (!animalData || !user) return <Empty />;
		if (Array.isArray(animalData.categories) && animalData.categories.length) {
			categoryName = animalData.categories[0].name;
		}

		const items: TabsProps['items'] = [
			{
				key: '1',
				label: `Details`,
				children: animalData.bio ? animalData.bio : 'Animal details'
			},
			{
				key: '2',
				label: `Breeder`,
				children: (
					<AnimalBreederInfo
						breederId={animalData.breeder.id}
						name={animalData.breeder.businessName}
						avatarUrl={
							animalData.breeder.avatar
								? animalData.breeder.avatar.url
								: require(`../../assets/images/vectors/${randomVector}.png`)
						}
						description={animalData.breeder.aboutBusiness}
						address={animalData.breeder.businessAddress}
						verified={animalData.breeder.isVerified}
					/>
				)
			},
			{
				key: '3',
				label: `Documents`,
				children: (
					<Row className="breederDocuments" align={'middle'} justify={!animalData.documents.length || !Array.isArray(animalData.documents) ? 'center' : 'start'} gutter={[24, 24]}>
						{Array.isArray(animalData.documents) &&
							animalData.documents.length ?
							animalData.documents.map((data, index) => (
								<Col key={data.id} xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
									<BreederDocumentCard url={data.fileUrl.url} animalPage title={data.name} primary={index + 1 & 1 ? true : false} />
								</Col>
							)): <Empty/>}
					</Row>
				)
			},
			{
				key: '4',
				label: `Location`,
				children: (
					<div className="animalLocationMap">
						<iframe
							title="animal map"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26405.456686327652!2d123.88633469079231!3d10.326304363857895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999ba46f851e1%3A0x5b057b836416a1a3!2sGoogle%20eBloc%204!5e0!3m2!1sen!2sph!4v1686493307553!5m2!1sen!2sph"
							width="600"
							height="450"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						></iframe>
					</div>
				)
			},
			{
				key: '5',
				label: `Additional Details`,
				children: <Empty/>
			}
		];

		const renderAnimalCta = () => {
			if (!user || !user.isBuyer) return;
			if (!animalData) return;
			if (animalData.isDeleted) return;

			return (
				<div className="animalCta">
					<Button onClick={onBuy} className="" size="large" type="primary">
						Make Payment
					</Button>
					<Button onClick={onContactBreeder} className="" size="large" type="default">
						Contact breeder
					</Button>
				</div>
			);
		};

		return (
			<Row gutter={[24, 24]} className="animalContentRow">
				<Col className="animalPreviewContainer" lg={12}>
					<ImageGallery {...imageGalleryProps} items={images} />
				</Col>
				<Col className="animalInfoContainer" lg={12}>
					<Typography.Text className="animalCategory">{categoryName}</Typography.Text>
					<div className="animalNameHeader">
						<div className="animalTitle">
							<PageTitle className="animalName" title={animalData.name} />
							{user.isBuyer && (
								<i onClick={saved ? onUnsave : onSave} className={`ri-heart-${saved ? `fill saved` : `line`} ri-xl`}></i>
							)}
						</div>
						<Typography.Title className="animalPricing" level={2}>
							{FormatMoney(animalData.price)}
						</Typography.Title>
					</div>
					<Tabs className="animalInfoTabs" defaultActiveKey="1" items={items} onChange={onChange} />
					{renderAnimalCta()}
					<div className="animalShareSocials">
						<Typography.Text>Share on: </Typography.Text>
						<div className="animalSocials">
							<FacebookShareButton
								url={window.location.href}
								title={`Hey, check this out, ${animalData.name}!`}
								hashtag="myBreederStore"
							>
								<i className="ri-facebook-circle-line ri-xl"></i>
							</FacebookShareButton>
							<TwitterShareButton
								url={window.location.href}
								title={`Hey, check this out, ${animalData.name}!`}
								hashtags={['VolcanicRetail']}
							>
								<i className="ri-twitter-line ri-xl"></i>
							</TwitterShareButton>
							<TelegramShareButton url={window.location.href} title={animalData.name}>
								<i className="ri-telegram-line ri-xl"></i>
							</TelegramShareButton>
							<WhatsappShareButton title={animalData.name} url={window.location.href}>
								<i className="ri-whatsapp-line ri-xl"></i>
							</WhatsappShareButton>
							<PinterestShareButton
								title={animalData.name}
								url={window.location.href}
								media={
									'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
								}
								description={animalData.bio}
							>
								<i className="ri-pinterest-line ri-xl"></i>
							</PinterestShareButton>
							<i onClick={onCopyToClipboard} className="ri-links-line ri-xl"></i>
						</div>
					</div>
				</Col>
				<ContactBreederPopup
					opened={openContactBreeder}
					breeder={animalData.breeder}
					onCancel={() => setOpenContactBreeder(false)}
					onForceCb={() => console.log('object')}
				/>
			</Row>
		);
	};

	return (
		<PrivateLayout className="animalPage customLayoutWidth">
			{renderAnimalDetails()}
			<CheckoutDrawer
				opened={openCheckout}
				animal={animalData}
				onCancel={() => setOpenCheckout(false)}
				onForceCb={() => console.log('object')}
			/>
		</PrivateLayout>
	);
};

export default Animalpage;
