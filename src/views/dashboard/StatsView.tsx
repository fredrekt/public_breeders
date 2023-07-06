import React, { useEffect, useState } from 'react';
import { Col, Result, Row, Typography } from 'antd';
import StatsCard from '../../components/StatsCard/StatsCard';
import './StatsView.scss';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import dogImg from '../../assets/images/register.png';

const StatsView: React.FC = () => {
	const [count, setCount] = useState({
		total: 0,
		pups: 0,
		upcoming: 0,
		studs: 0,
		showcase: 0,
		orders: 0
	});

	const {
		total,
		pups,
		upcoming,
		studs,
		showcase,
		orders
	} = count;

	const loadStatCount = async () => {
		try {
			const res = (await axios(`${API_URL}/statistic`)).data;
			setCount(res);
		} catch (error) {
			console.log(`Something wen't wrong in getting count data.`);
		}
	}

	useEffect(() => {
		loadStatCount();
	}, [])

	return (
		<div className="statsViewContainer">
			<Typography.Title className="s" level={3}>
				Stats
			</Typography.Title>
			<Row className="statsContainer" gutter={[16, 16]}>
				<Col lg={4} xl={4} xxl={4}>
					<StatsCard title="Total Listing" count={total} />
				</Col>
				<Col lg={4} xl={4} xxl={4}>
					<StatsCard title="Orders" count={orders} />
				</Col>
				<Col lg={4} xl={4} xxl={4}>
					<StatsCard title="Pups for Sale" count={pups} />
				</Col>
				<Col lg={4} xl={4} xxl={4}>
					<StatsCard title="Upcoming Litters" count={upcoming} />
				</Col>
				<Col lg={4} xl={4} xxl={4}>
					<StatsCard title="Stud Profiles" count={studs} />
				</Col>
				<Col lg={4} xl={4} xxl={4}>
					<StatsCard title="Showcase" count={showcase} />
				</Col>
			</Row>
			<Result
				icon={<img src={dogImg} alt="missing" />}
				title="Upcoming Chart"
				subTitle="This functionality will be in the next release."
			/>
		</div>
	);
};

export default StatsView;
