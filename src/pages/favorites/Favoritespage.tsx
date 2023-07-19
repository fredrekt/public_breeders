import React, { useEffect, useState } from 'react';
import './Favoritespage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Col, Empty, Row, message } from 'antd';
import BreederCard from '../../components/BreederCard/BreederCard';
import { Api } from '../../models/api';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { useUserContext } from '../../context/UserContext';

const Favoritespage: React.FC = () => {
	const { user } = useUserContext();
	const [favorites, setFavorites] = useState<Api.Favorite.Res.FavoriteListing[]>([]);

	const loadFavorites = async () => {
		if (!user) return;
		try {
			// eslint-disable-next-line
			const res = (await axios.get(`${API_URL}/favorites?populate=deep,4&filters[user\][id][$eq]=${user.id}`)).data;
			setFavorites(res.data);
		} catch (error) {	
			message.error(`Something wen't wrong in getting list of favorites.`);
		}
	}

	useEffect(() => {
		loadFavorites();
		// eslint-disable-next-line
	}, [user]);

	const renderFavoritesListing = () => {
		if (!Array.isArray(favorites) || !favorites.length) return <Empty/>;
		return favorites.map((data) => (
			<Col key={data.id} xs={12} sm={12} md={8} lg={6} xl={6} xxl={6}>
				<BreederCard
					id={data.animal.id}
					name={data.animal.name}
					previewUrl={Array.isArray(data.animal.images) && data.animal.images.length ? data.animal.images[0].url : ''}
					favorite
					ownerName={data.animal.breeder.businessName}
					ownerProfileImageUrl={data.animal.breeder.avatar ? data.animal.breeder.avatar.url : ''}
					pricing={data.animal.price}
				/>
			</Col>
		))
	}

	return (
		<PrivateLayout className="favoritesPage customLayoutWidth">
			<PageTitle title="Favorites" />
			<div className="favoritesContent">
				<Row className="breederStoreFilterCategory" justify={'center'} gutter={[24, 24]}>
					{renderFavoritesListing()}
				</Row>
			</div>
		</PrivateLayout>
	);
};

export default Favoritespage;
