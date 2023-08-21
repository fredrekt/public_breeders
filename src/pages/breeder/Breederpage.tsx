import React, { useEffect, useState } from 'react';
import './Breederpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import { Avatar, Button, Card, Col, Empty, Image, Row, Typography, message } from 'antd';
import { faker } from '@faker-js/faker';
import BreederDocumentCard from '../../components/BreederDocumentCard/BreederDocumentCard';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useParams } from 'react-router-dom';
import ContactBreederPopup from '../../popups/ContactBreeder/ContactBreederPopup';
import { Model } from '../../models/model';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { useUserContext } from '../../context/UserContext';
import { randomVector } from '../../utils/randomVector';
import BreederStorefront from '../../components/BreederShopfront/BreederStorefront';

const Breederpage: React.FC = () => {
	const { user } = useUserContext();
	const { id } = useParams();
	const [openContactBreeder, setOpenContactBreeder] = useState<boolean>(false);
	const [breederData, setBreederData] = useState<Model.Breeder | null>(null);

	const loadBreederData = async () => {
		if (!id) return;
		try {
			const res = (await axios.get(`${API_URL}/breeders/${id}?populate=deep,2`)).data;
			if (res.data) {
				setBreederData(res.data);
			}
		} catch (error) {
			message.error(`Something wen't wrong in getting breeder details.`);
		}
	};

	useEffect(() => {
		loadBreederData();
		// eslint-disable-next-line
	}, [id]);

	const renderBreederContactCta = () => {
		if (!user || !user.isBuyer) return;
		return (
			<Button
				onClick={() => setOpenContactBreeder(true)}
				className="breederContactCta"
				type="primary"
				size="large"
			>
				Contact Breeder
			</Button>
		);
	};

	const renderBreederDetails = () => {
		if (!breederData) return <Empty />;
		return (
			<Row className="breederContent" gutter={[24, 24]}>
				<Col lg={6}>
					<Card className="breederCardProfile">
						<Avatar
							size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
							shape={'circle'}
							src={
								breederData.avatar
									? breederData.avatar.url
									: require(`../../assets/images/vectors/${randomVector}.png`)
							}
						/>
						<PageTitle className="breederName" title={breederData.businessName} level={2} />
						<Typography.Paragraph className="breederLocation">
							<i className="ri-map-pin-line"></i>
							{breederData.businessAddress ? breederData.businessAddress : 'Location, City'}
						</Typography.Paragraph>

						<Typography.Paragraph className="breederDescription">
							{breederData.aboutBusiness ? breederData.aboutBusiness : faker.lorem.paragraphs(1)}
						</Typography.Paragraph>

						<Avatar.Group className="breederCustomersList">
							<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
							<Avatar src={faker.image.avatar()} />
							<Avatar src={faker.image.avatar()} />
							<Avatar src={faker.image.avatar()} />
							<Avatar src={faker.image.avatar()} />
						</Avatar.Group>
						{renderBreederContactCta()}
					</Card>
					<Card className="breederCardDocuments">
						<Typography.Title className="breederCardDocumentHeadingTxt" level={4}>
							Documents
						</Typography.Title>
						<div className="breederCardDocumentList">
							<BreederDocumentCard url="" title="Pedigree Paper of Sire" primary />
							<BreederDocumentCard url="" title="Pedigree Paper of Damn" primary />
							<BreederDocumentCard url="" title="Vaccination Records" />
							<BreederDocumentCard url="" title="Vet Checks" />
							<BreederDocumentCard url="" title="Video" primary />
						</div>
					</Card>
				</Col>
				<Col lg={18}>
					<BreederStorefront breederId={id} />
				</Col>
				<ContactBreederPopup
					opened={openContactBreeder}
					breeder={breederData}
					onCancel={() => setOpenContactBreeder(false)}
					onForceCb={() => console.log('object')}
				/>
			</Row>
		);
	};

	const renderCoverPhoto = () => {
		if (!breederData) return;
		return (
			<div className="breederCoverPhoto">
				<Image
					preview={false}
					src={
						breederData.coverPhoto
							? breederData.coverPhoto.url
							: 'https://images.pexels.com/photos/2774140/pexels-photo-2774140.jpeg?auto=compress&cs=tinysrgb&w=1600'
					}
				/>
			</div>
		);
	};

	return (
		<PrivateLayout className="breederPage">
			<div className="">
				{renderCoverPhoto()}
				{renderBreederDetails()}
			</div>
		</PrivateLayout>
	);
};

export default Breederpage;
