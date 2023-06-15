import React from 'react';
import './Homepage.scss';
import BreederStorefront from '../../components/breederStorefront/BreederStorefront';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import { Typography } from 'antd';

const Homepage: React.FC = () => {
	return (
		<PrivateLayout className="homepage">
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
		</PrivateLayout>
	);
};

export default Homepage;
