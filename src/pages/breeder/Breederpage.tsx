import React from 'react';
import './Breederpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import { Avatar, Button, Card, Col, Image, Row, Typography } from 'antd';
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
			<Row className="breederContent" gutter={[24, 24]}>
				<Col lg={6}>
					<Card className="breederCardProfile">
						<Avatar
							size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
							shape={'circle'}
							src={faker.image.avatar()}
						/>
						<PageTitle className="breederName" title="ForbzBullies" level={2} />
						<Typography.Paragraph className="breederLocation">
							<i className="ri-map-pin-line"></i>
							Melbourne VIC, Australia
						</Typography.Paragraph>

						<Typography.Paragraph className='breederDescription'>
							{faker.lorem.paragraphs(1)}
						</Typography.Paragraph>

						<Avatar.Group className='breederCustomersList'>
							<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
							<Avatar src={faker.image.avatar()} />
							<Avatar src={faker.image.avatar()} />
							<Avatar src={faker.image.avatar()} />
							<Avatar src={faker.image.avatar()} />
						</Avatar.Group>

						<Button className="breederContactCta" type="primary" size="large">
							Contact Breeder
						</Button>
					</Card>
					<Card className='breederCardDocuments'>
						<Typography.Title className='breederCardDocumentHeadingTxt' level={4}>
							Documents
						</Typography.Title>
						<div className="breederCardDocumentList">
							<BreederDocumentCard title="Pedigree Paper of Sire" primary />
							<BreederDocumentCard title="Pedigree Paper of Damn" primary />
							<BreederDocumentCard title="Vaccination Records" />
							<BreederDocumentCard title="Vet Checks" />
							<BreederDocumentCard title="Video" primary />
						</div>
					</Card>
				</Col>
				<Col lg={18}>
					<BreederStorefront breederId={id} />
				</Col>
			</Row>
		</PrivateLayout>
	);
};

export default Breederpage;
