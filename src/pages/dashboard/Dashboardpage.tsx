import React, { useState } from 'react';
import './Dashboardpage.scss';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Avatar, Col, Layout, Menu, Row, message, theme } from 'antd';
import logoImg from '../../assets/images/logo.png';
import StatsView from '../../views/dashboard/StatsView';
import DatatablesView from '../../views/dashboard/DatatablesView';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { removeToken } from '../../utils/authHelpers';

const { Sider, Content, Header } = Layout;

const Dashboardpage: React.FC = () => {
	const navigate = useNavigate();
	const { user, isLoading } = useUserContext();
	const [selectedView, setSelectedView] = useState<number>(0);

	const {
		token: { colorBgContainer }
	} = theme.useToken();

	const menuHeaderLabels = ['Dashboard', 'Pups Listing', 'Upcoming Listing', 'Stud Listing', 'Showcase Listing'];
	const menuLabels = ['Stats', 'Pups for Sale', 'Upcoming Litters', 'Stud Profiles', 'Showcase', 'Logout'];
	const listOfViews = [
		<StatsView />,
		<DatatablesView title="Pups for Sale" categoryId={2} />,
		<DatatablesView title="Upcoming Litters" categoryId={4} />,
		<DatatablesView title="Stud Profiles" categoryId={1} />,
		<DatatablesView title="Showcase Profiles" categoryId={3} />
	];

	if (!user || isLoading) return <p>loading</p>;
	if (user.isBuyer) {
		navigate(`/`);
	}

	return (
		<Layout className="dashboardPage">
			<Sider
				className="dashboardSider"
				theme="light"
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={(broken) => {
					console.log(broken);
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type);
				}}
			>
				<Link to="/">
					<Avatar
						className="dashboardMenuLogo"
						size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 64, xxl: 64 }}
						src={logoImg}
					/>
				</Link>
				<Menu
					className="dashboardMenu"
					theme="light"
					mode="inline"
					defaultSelectedKeys={[selectedView.toString()]}
					onSelect={(e: any) => {
						if (e.key === '5') {
							removeToken();
							message.success('Successfully logged out.');
							navigate('/login');
							return;
						} else {
							setSelectedView(e.key);
						}
					}}
					items={[
						<i className="ri-line-chart-line"></i>,
						<i className="ri-price-tag-3-line"></i>,
						<i className="ri-calendar-event-line"></i>,
						<i className="ri-profile-line"></i>,
						<i className="ri-slideshow-3-line"></i>,
						<i className='ri-logout-circle-line'></i>
					].map((icon, index) => ({
						key: String(index),
						icon: icon,
						label: menuLabels[index]
					}))}
				/>
			</Sider>
			<Layout className="dashboardContentView">
				<Header className="dashboardHeader">
					<PageTitle level={2} className="dashboardHeaderTxt" title={menuHeaderLabels[selectedView]} />
				</Header>
				<Content className="dashboardContent">
					<div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
						<Row>
							<Col span={24}>{listOfViews[selectedView]}</Col>
						</Row>
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default Dashboardpage;
