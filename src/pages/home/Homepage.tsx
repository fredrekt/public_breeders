import React from 'react';
import './Homepage.scss';
import { Typography } from 'antd';
import PublicLayout from '../../layouts/public/PublicLayout';
import { getToken } from '../../utils/authHelpers';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import BreederStorefront from '../../components/BreederShopfront/BreederStorefront';
import ProtectedRoute from '../../utils/ProtectedRoute';

const Homepage: React.FC = () => {
	const loggedIn: boolean = getToken() !== '';

	const renderLandingPage = () => {
		const neutralStoreFront = (
			<>
				<div className="homepageBannerHero">
					<div className="homepageBannerImgContainer">
						<img
							src="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=1600"
							className="homepageBannerImg"
							alt="hero banner"
						/>
					</div>
					<Typography.Title className="homepageBannerTitle" level={1}>
						My Breeders Store
					</Typography.Title>
				</div>
				<BreederStorefront />
			</>
		);
		if (loggedIn) {
			return <ProtectedRoute><PrivateLayout className="homepage">{neutralStoreFront}</PrivateLayout></ProtectedRoute>;
		} else {
			return (
				<PublicLayout navbar className="homepage">
					{neutralStoreFront}
				</PublicLayout>
			);
		}
	};

	return renderLandingPage();
};

export default Homepage;
