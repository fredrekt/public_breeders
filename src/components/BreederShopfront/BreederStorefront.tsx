import React, { useEffect, useState } from 'react';
import './BreederStorefront.scss';
import BreederCard from '../BreederCard/BreederCard';
import { Button, Col, Empty, Input, Row, Select, Typography, message } from 'antd';
import BreederCategoryCard from '../BreederCategoryCard/BreederCategoryCard';
import AdvancedBreederStorefrontFilterDrawer from '../../drawers/AdvancedBreederStorefrontFilter/AdvancedBreederStorefrontFilterDrawer';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { Api } from '../../models/api';
import { Model } from '../../models/model';
import { getToken } from '../../utils/authHelpers';
import { useLocation } from 'react-router-dom';

const Fade = require('react-reveal/Fade');

interface BreederStorefrontProps {
	breederId?: string;
}

type SortByTypes = 'asc' | 'desc' | 'createdDesc' | 'createdAsc' | '';

const BreederStorefront: React.FC<BreederStorefrontProps> = ({ breederId }) => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const paramCategoryId: string | null = queryParams.get('categoryId');
	const [listOfBreeders, setListOfBreeders] = useState<Api.Animal.Res.AnimalListing[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [openAdvancedFilter, setOpenAdvancedFiter] = useState<boolean>(false);
	const [categories, setCategories] = useState<Model.Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<number>(0);
	const [sortBy, setSortBy] = useState<SortByTypes>('');

	const loadListOfBreeders = async () => {
		try {
			let qry = `?populate=deep,3&filters[isDeleted][$eq]=false`;
			if (breederId) {
				// eslint-disable-next-line
				qry += `&filters[breeder\][id][$eq]=${breederId}`;
			}
			if (selectedCategory) {
				// eslint-disable-next-line
				qry += `&filters[categories\][id][$eq]=${selectedCategory}`;
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
			message.error(`Something wen't wrong in loading categories.`);
		}
	};

	useEffect(() => {
		loadListOfCategories();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const loadParamsCategoryId = () => {
			if (!paramCategoryId) {
				if (!selectedCategory) {
					setSelectedCategory(0);
				}
				return;
			}
			const parsedCategoryId: number = parseInt(paramCategoryId);
			setSelectedCategory(parsedCategoryId);
		}
		loadParamsCategoryId();
	}, [paramCategoryId, selectedCategory]);

	useEffect(() => {
		loadListOfBreeders();
		// eslint-disable-next-line
	}, [selectedCategory, breederId]);

	const renderListOfBreeders = () => {
		if (!Array.isArray(listOfBreeders) || !listOfBreeders.length) return <Empty/>;
		let listOfBreedersData = listOfBreeders.filter((data) => !data.isDeleted);

		if (searchValue) {
			listOfBreedersData = listOfBreeders.filter((data) =>
				data.name.toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		if (sortBy) {
			switch (sortBy) {
				case 'desc':
					listOfBreedersData = listOfBreeders.sort((a, b) => b['name'].localeCompare(a['name']));
					break;
				case 'asc':
					listOfBreedersData = listOfBreeders.sort((a, b) => a['name'].localeCompare(b['name']));
					break;
				case 'createdDesc':
					listOfBreedersData = listOfBreeders.sort(
						(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
					break;
				case 'createdAsc':
					listOfBreedersData = listOfBreeders.sort(
						(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
					break;
				default:
					break;
			}
		}

		return listOfBreedersData.map((data) => (
			<Col
				key={data.id}
				xs={24}
				sm={24}
				md={breederId ? 12 : 8}
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
		if (!getToken()) return;
		return categories.map((category) => (
			<Col key={category.id} xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
				<BreederCategoryCard
					selectedCategoryId={selectedCategory}
					onClick={(categoryId: number) => setSelectedCategory(categoryId)}
					id={category.id}
					name={category.name}
					icon={category.icon}
				/>
			</Col>
		));
	};

	return (
		<div className="breederStorefront customLayoutWidth">
			<div className="breederStoreContent">
				<Row className={`breederStoreFilterCategory ${!breederId && getToken() ? 'relativePos' : ''} ${!getToken() ? 'unauthMarketplace' : ''}`} justify={'center'} gutter={[24, 24]}>
					{renderCategories()}
				</Row>
				<Row className="breederStorefrontFilters" gutter={[24, 24]}>
					<Col xs={getToken() ? 20 : 24} sm={getToken() ? 20 : 24} lg={!getToken() ? 18 : 20} xl={!getToken() ? 18 : 20} xxl={!getToken() ? 18 : 20}>
						<Input
							className='searchFilter'
							prefix={<i className="ri-search-line ri-lg primary-color-icon"></i>}
							size="large"
							value={searchValue}
							placeholder="Find breeders here"
							onChange={(e: any) => setSearchValue(e.target.value)}
						/>
					</Col>
					<Col xs={0} sm={0} lg={!getToken() ? 6 : 2} xl={!getToken() ? 6 : 2} xxl={!getToken() ? 6 : 2}>
						<Select
							placeholder={getToken() ? "A-Z" : 'Filter'}
							className="sortBySelect"
							suffixIcon={<i className="ri-sort-desc ri-2x primary-color-icon"></i>}
							size="large"
							onChange={(e: any) => setSortBy(e)}
						>
							<Select.Option value="asc">(A - Z)</Select.Option>
							<Select.Option value="desc">(Z - A)</Select.Option>
							<Select.Option value="createdDesc">Newest</Select.Option>
							<Select.Option value="createdAsc">Oldest</Select.Option>
						</Select>
					</Col>
					<Col xs={getToken() ? 4 : 24} sm={getToken() ? 4 : 24} className="sortFilterCta" lg={!getToken() ? 0 : 2} xl={!getToken() ? 0 : 2} xxl={!getToken() ? 0 : 2}>
						<Button onClick={() => setOpenAdvancedFiter(true)} size="large">
							<i className="ri-equalizer-line ri-lg primary-color-icon"></i>
							<Typography.Text className='sortFilterCtaTxt'>Filter</Typography.Text>
						</Button>
					</Col>
				</Row>
				<Row justify={!Array.isArray(listOfBreeders) || !listOfBreeders.length ? 'center' : 'start'} gutter={[24, 24]}>{renderListOfBreeders()}</Row>
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
