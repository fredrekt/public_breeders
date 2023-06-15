import React from 'react';
import './Favoritespage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Col, Row } from 'antd';
import { faker } from '@faker-js/faker';
import BreederCard from '../../components/BreederCard/BreederCard';

const Favoritespage: React.FC = () => {
	return (
		<PrivateLayout className="favoritesPage customLayoutWidth">
			<PageTitle title="Favorites" />
			<div className="favoritesContent">
				<Row className="breederStoreFilterCategory" justify={'center'} gutter={[24, 24]}>
					<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
						<BreederCard
							id={faker.number.int()}
							name={faker.animal.dog()}
							previewUrl={
								'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
							}
							ownerName={faker.person.fullName()}
							ownerProfileImageUrl={faker.image.avatar()}
							pricing={faker.finance.amount()}
						/>
					</Col>
					<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
						<BreederCard
							id={faker.number.int()}
							name={faker.animal.dog()}
							previewUrl={
								'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
							}
							ownerName={faker.person.fullName()}
							ownerProfileImageUrl={faker.image.avatar()}
							pricing={faker.finance.amount()}
						/>
					</Col>
					<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
						<BreederCard
							id={faker.number.int()}
							name={faker.animal.dog()}
							previewUrl={
								'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
							}
							ownerName={faker.person.fullName()}
							ownerProfileImageUrl={faker.image.avatar()}
							pricing={faker.finance.amount()}
						/>
					</Col>
					<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
						<BreederCard
							id={faker.number.int()}
							name={faker.animal.dog()}
							previewUrl={
								'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
							}
							ownerName={faker.person.fullName()}
							ownerProfileImageUrl={faker.image.avatar()}
							pricing={faker.finance.amount()}
						/>
					</Col>
					<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
						<BreederCard
							id={faker.number.int()}
							name={faker.animal.dog()}
							previewUrl={
								'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
							}
							ownerName={faker.person.fullName()}
							ownerProfileImageUrl={faker.image.avatar()}
							pricing={faker.finance.amount()}
						/>
					</Col>
					<Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
						<BreederCard
							id={faker.number.int()}
							name={faker.animal.dog()}
							previewUrl={
								'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
							}
							ownerName={faker.person.fullName()}
							ownerProfileImageUrl={faker.image.avatar()}
							pricing={faker.finance.amount()}
						/>
					</Col>
				</Row>
			</div>
		</PrivateLayout>
	);
};

export default Favoritespage;
