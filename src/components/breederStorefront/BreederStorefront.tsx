import React, { useEffect, useState } from 'react';
import './BreederStorefront.scss';
import BreederCard from '../BreederCard/BreederCard';
import { faker } from '@faker-js/faker';
import { Button, Col, Input, Row, Select, message } from 'antd';
import BreederCategoryCard from '../BreederCategoryCard/BreederCategoryCard';
import AdvancedBreederStorefrontFilterDrawer from '../../drawers/AdvancedBreederStorefrontFilter/AdvancedBreederStorefrontFilterDrawer';
const Fade = require('react-reveal/Fade');

interface BreederStorefrontProps {
	breederId?: string;
}

const BreederStorefront: React.FC<BreederStorefrontProps> = ({ breederId }) => {
	const [listOfBreeders, setListOfBreeders] = useState<any[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [openAdvancedFilter, setOpenAdvancedFiter] = useState<boolean>(false);

	const randomBreederImages = [
		'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/895259/pexels-photo-895259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/3658120/pexels-photo-3658120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/4056462/pexels-photo-4056462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/4056462/pexels-photo-4056462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/7210748/pexels-photo-7210748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/7210748/pexels-photo-7210748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/16623449/pexels-photo-16623449/free-photo-of-dog-on-yellow-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
	];

	const loadListOfBreeders = async () => {
		try {
			let mockData: any[] = [];
			for (let i = 0; i <= 15; i++) {
				let data = {
					id: i + 1,
					name: faker.animal.dog(),
					previewUrl: randomBreederImages[Math.floor(Math.random() * randomBreederImages.length)],
					ownerName: faker.person.fullName(),
					ownerProfileImageUrl: faker.image.avatar(),
					pricing: faker.finance.amount()
				};
				mockData.push(data);
			}
			setListOfBreeders(mockData);
		} catch (error) {
			message.error(`Something wen't wrong in getting list of breeders.`);
		}
	};

	useEffect(() => {
		loadListOfBreeders();
		// eslint-disable-next-line
	}, []);

	const renderListOfBreeders = () => {
		if (!Array.isArray(listOfBreeders) || !listOfBreeders.length) return;
		let listOfBreedersData = listOfBreeders;

		if (searchValue) {
			listOfBreedersData = listOfBreeders.filter((data) =>
				data.name.toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		return listOfBreedersData.map((data) => (
			<Col key={data.id} xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
				<Fade>
					<BreederCard
						id={data.id}
						name={data.name}
						previewUrl={data.previewUrl}
						ownerName={data.ownerName}
						ownerProfileImageUrl={data.ownerProfileImageUrl}
						pricing={data.pricing}
					/>
				</Fade>
			</Col>
		));
	};

	return (
		<div className="breederStorefront customLayoutWidth">
			<div className="breederStoreContent">
				<Row className="breederStoreFilterCategory" justify={'center'} gutter={[24, 24]}>
					<Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
						<BreederCategoryCard id={1} name={faker.animal.type()} icon="gatsby-fill" />
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
						<BreederCategoryCard id={1} name={faker.animal.type()} icon="gitlab-fill" />
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
						<BreederCategoryCard id={1} name={faker.animal.type()} icon="evernote-fill" />
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
						<BreederCategoryCard id={1} name={faker.animal.type()} icon="apple-fill" />
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
						<BreederCategoryCard id={1} name={faker.animal.type()} icon="openbase-fill" />
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
						<BreederCategoryCard id={1} name={faker.animal.type()} icon="twitter-fill" />
					</Col>
				</Row>
				<Row className="breederStorefrontFilters" gutter={[24, 24]}>
					<Col span={16}>
						<Input
							prefix={<i className="ri-search-line"></i>}
							size="large"
							value={searchValue}
							placeholder="Find breeders here"
							onChange={(e: any) => setSearchValue(e.target.value)}
						/>
					</Col>
					<Col span={7}>
						<Select
							placeholder="A-Z"
							className="sortBySelect"
							suffixIcon={<i className="ri-sort-desc ri-xl"></i>}
							size="large"
						>
							<Select.Option value="asc">(A - Z)</Select.Option>
							<Select.Option value="desc">(Z - A)</Select.Option>
							<Select.Option value="createdDesc">Newest</Select.Option>
							<Select.Option value="createdAsc">Oldest</Select.Option>
						</Select>
					</Col>
					<Col className="sortFilterCta" span={1}>
						<Button onClick={() => setOpenAdvancedFiter(true)} size="large">
							<i className="ri-equalizer-line ri-lg"></i>
						</Button>
					</Col>
				</Row>
				<Row gutter={[24, 24]}>{renderListOfBreeders()}</Row>
			</div>
			<AdvancedBreederStorefrontFilterDrawer
				opened={openAdvancedFilter}
				onCancel={() => setOpenAdvancedFiter(false)}
				onForceCb={() => console.log('object')}
			/>
		</div>
	);
};

export default BreederStorefront;
