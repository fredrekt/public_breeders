import React from 'react';
import './Breederpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import { Avatar, Col, Descriptions, Image, Row, Typography } from 'antd';
import { faker } from '@faker-js/faker';
import BreederDocumentCard from '../../components/BreederDocumentCard/BreederDocumentCard';
import PageTitle from '../../components/PageTitle/PageTitle';
import BreederStorefront from '../../components/breederStorefront/BreederStorefront';
import { useParams } from 'react-router-dom';

const Breederpage: React.FC = () => {
	const { id } = useParams();

	return (
		<PrivateLayout className="breederPage">
			<div className="breederCoverPhoto">
				<Image
					src={
						'https://images.pexels.com/photos/2774140/pexels-photo-2774140.jpeg?auto=compress&cs=tinysrgb&w=1600'
					}
				/>
			</div>
			<div className="customLayoutWidth breederContent">
				<PageTitle className="breederName" title="ForbzBullies" />
				<Typography.Paragraph className="breederLocation">
					<i className="ri-map-pin-line"></i>
					Melbourne VIC, Australia
				</Typography.Paragraph>
				<div className="breederOwnerInfo">
					<Avatar
						size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
						shape={'circle'}
						src={faker.image.avatar()}
					/>
					<Typography.Title level={3} className="breederOwnerName">
						{faker.person.fullName()}
					</Typography.Title>
				</div>
				<div className="breederDetails">
					<Descriptions title="Description">
						<Descriptions.Item contentStyle={{ display: 'none' }} label={faker.lorem.paragraphs(5)}>
							no content
						</Descriptions.Item>
					</Descriptions>
					<Row className="breederDocuments" justify={'center'} gutter={[24, 24]}>
						<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
							<BreederDocumentCard title="Pedigree Paper of Sire" primary />
						</Col>
						<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
							<BreederDocumentCard title="Pedigree Paper of Damn" primary />
						</Col>
						<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
							<BreederDocumentCard title="Vaccination Records" />
						</Col>
						<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
							<BreederDocumentCard title="Vet Checks" />
						</Col>
						<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
							<BreederDocumentCard title="Video" primary />
						</Col>
					</Row>
				</div>
			</div>
			<BreederStorefront breederId={id} />
		</PrivateLayout>
	);
};

export default Breederpage;
