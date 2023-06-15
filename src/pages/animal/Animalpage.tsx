import React, { useState } from 'react';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Button, Col, Row, Typography, message } from 'antd';
import BreederDocumentCard from '../../components/BreederDocumentCard/BreederDocumentCard';
import ImageGallery from 'react-image-gallery';
import './Animalpage.scss';
import { faker } from '@faker-js/faker';
import FormatMoney from '../../utils/FormatMoney';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useCopyToClipboard } from 'usehooks-ts';
import AnimalBreederInfo from '../../components/AnimalBreederInfo/AnimalBreederInfo';

const Animalpage: React.FC = () => {
	const [saved, setSaved] = useState<boolean>(false);
	const [value, copy] = useCopyToClipboard();

	const images = [
		{
			thumbnailClass: 'thumbnailAnimalGallery',
			original:
				'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			thumbnail:
				'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
		},
		{
			thumbnailClass: 'thumbnailAnimalGallery',
			original:
				'https://images.pexels.com/photos/3487734/pexels-photo-3487734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			thumbnail:
				'https://images.pexels.com/photos/3487734/pexels-photo-3487734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
		},
		{
			thumbnailClass: 'thumbnailAnimalGallery',
			original:
				'https://images.pexels.com/photos/12424394/pexels-photo-12424394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			thumbnail:
				'https://images.pexels.com/photos/12424394/pexels-photo-12424394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
		}
	];

	const imageGalleryProps = {
		showNav: false,
		showPlayButton: false,
		showFullscreenButton: false
	};

	const onChange = (key: string) => {
		console.log(key);
	};

	const items: TabsProps['items'] = [
		{
			key: '1',
			label: `Details`,
			children: faker.lorem.paragraphs(10)
		},
		{
			key: '2',
			label: `Breeder`,
			children: (
				<AnimalBreederInfo
					breederId="sa"
					name={faker.company.name()}
					avatarUrl={faker.image.avatar()}
					description={faker.lorem.sentences(2)}
					address={faker.location.streetAddress()}
					verified
				/>
			)
		},
		{
			key: '3',
			label: `Documents`,
			children: (
				<Row className="breederDocuments" justify={'center'} gutter={[24, 24]}>
					<Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
						<BreederDocumentCard animalPage title="Pedigree Paper of Sire" primary />
					</Col>
					<Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
						<BreederDocumentCard animalPage title="Pedigree Paper of Damn" primary />
					</Col>
					<Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
						<BreederDocumentCard animalPage title="Vaccination Records" />
					</Col>
					<Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
						<BreederDocumentCard animalPage title="Vet Checks" />
					</Col>
					<Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
						<BreederDocumentCard animalPage title="Video" primary />
					</Col>
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
			children: faker.lorem.paragraphs(10)
		}
	];

	const onSave = async () => {
		message.success('Successfully added to favorites.');
		setSaved(!saved);
	};

	const onAdd = async () => {
		message.success('Successfully added to cart.');
	};

	const onBuy = async () => {
		message.success('Successfully bought breeder.');
	};

	const onCopyToClipboard = () => {
		copy(window.location.href);
		console.log('copied link ', value);
		message.success('Successfully copied to clipboard.');
	};

	return (
		<PrivateLayout className="animalPage customLayoutWidth">
			<Row gutter={[24, 24]} className="animalContentRow">
				<Col className="animalPreviewContainer" lg={12}>
					<ImageGallery {...imageGalleryProps} items={images} />
				</Col>
				<Col className="animalInfoContainer" lg={12}>
					<Typography.Text className="animalCategory">Dog</Typography.Text>
					<div className="animalNameHeader">
						<div className="animalTitle">
							<PageTitle className="animalName" title={'American Bully'} />
							<i onClick={onSave} className={`ri-heart-${saved ? `fill saved` : `line`} ri-xl`}></i>
						</div>
						<Typography.Title className="animalPricing" level={2}>
							{FormatMoney(faker.number.int(500))}
						</Typography.Title>
					</div>
					<Tabs className="animalInfoTabs" defaultActiveKey="1" items={items} onChange={onChange} />
					<div className="animalCta">
						<Button onClick={onAdd} className="" size="large" type="primary">
							add to cart
						</Button>
						<Button onClick={onBuy} className="" size="large" type="default">
							Buy now
						</Button>
					</div>
					<div className="animalShareSocials">
						<Typography.Text>Share on: </Typography.Text>
						<div className="animalSocials">
							<i className="ri-facebook-circle-line ri-xl"></i>
							<i className="ri-twitter-line ri-xl"></i>
							<i className="ri-instagram-line ri-xl"></i>
							<i className="ri-pinterest-line ri-xl"></i>
							<i onClick={onCopyToClipboard} className="ri-links-line ri-xl"></i>
						</div>
					</div>
				</Col>
			</Row>
		</PrivateLayout>
	);
};

export default Animalpage;
