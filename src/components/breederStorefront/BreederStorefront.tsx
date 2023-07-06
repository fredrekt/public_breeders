import React, { useEffect, useState } from 'react';
import './BreederStorefront.scss';
import BreederCard from '../BreederCard/BreederCard';
import { Button, Col, Input, Row, Select, message } from 'antd';
import BreederCategoryCard from '../BreederCategoryCard/BreederCategoryCard';
import AdvancedBreederStorefrontFilterDrawer from '../../drawers/AdvancedBreederStorefrontFilter/AdvancedBreederStorefrontFilterDrawer';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { Api } from '../../models/api';
import { Model } from '../../models/model';

const Fade = require('react-reveal/Fade');

interface BreederStorefrontProps {
	breederId?: string;
}

const BreederStorefront: React.FC<BreederStorefrontProps> = ({ breederId }) => {
	const [listOfBreeders, setListOfBreeders] = useState<Api.Animal.Res.AnimalListing[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [openAdvancedFilter, setOpenAdvancedFiter] = useState<boolean>(false);
	const [categories, setCategories] = useState<Model.Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<number>(0);

	const loadListOfBreeders = async () => {
		try {
			let qry = `?populate=deep,3`;
			if (breederId) {
				// eslint-disable-next-line
				qry += `&filters[breeder\][id][$eq]=${breederId}`	
			}
			if (selectedCategory) {
				// eslint-disable-next-line
				qry += `&filters[categories\][id][$eq]=${selectedCategory}`
			}
			const res = (await axios.get(`${API_URL}/animals${qry}`)).data;
			setListOfBreeders(res.data);
		} catch (error) {
			message.error(`Something wen't wrong in getting list of breeders.`);
		}
	};

	const loadListOfCategories = async () => {
		try {
			const res = (await axios.get(`${API_URL}/categories`)).data;
			setCategories(res.data);
		} catch (error) {
			message.error(`Something wen't wrong in loading categories.`)
		}
	}

	useEffect(() => {
		loadListOfCategories();
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		loadListOfBreeders();
		// eslint-disable-next-line
	}, [selectedCategory, breederId]);

	const renderListOfBreeders = () => {
		if (!Array.isArray(listOfBreeders) || !listOfBreeders.length) return;
		let listOfBreedersData = listOfBreeders;

		if (searchValue) {
			listOfBreedersData = listOfBreeders.filter((data) =>
				data.name.toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		return listOfBreedersData.map((data) => (
			<Col
				key={data.id}
				xs={12}
				sm={12}
				md={8}
				lg={breederId ? 8 : 6}
				xl={breederId ? 8 : 6}
				xxl={breederId ? 8 : 6}
			>
				<Fade>
					<BreederCard
						id={data.id}
						name={data.name}
						previewUrl={Array.isArray(data.images) && data.images.length ? data.images[0].url : ''}
						ownerId={data.breeder.id}
						ownerName={data.breeder.businessName}
						ownerProfileImageUrl={data.breeder.avatar ? data.breeder.avatar.url : ''}
						pricing={data.price}
					/>
				</Fade>
			</Col>
		));
	};

	const renderCategories = () => {
		if (!Array.isArray(categories) || !categories.length) return;
		return categories.map((category) => (
			<Col key={category.id} xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
				<BreederCategoryCard selectedCategoryId={selectedCategory} onClick={(categoryId: number) => setSelectedCategory(categoryId)} id={category.id} name={category.name} icon="gatsby-fill" />
			</Col>
		))
	}

	return (
		<div className="breederStorefront customLayoutWidth">
			<div className="breederStoreContent">
				<Row className="breederStoreFilterCategory" justify={'center'} gutter={[24, 24]}>
					{renderCategories()}
				</Row>
				<Row className="breederStorefrontFilters" gutter={[24, 24]}>
					<Col span={breederId ? 15 : 16}>
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
					<Col className="sortFilterCta" span={breederId ? 2 : 1}>
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
