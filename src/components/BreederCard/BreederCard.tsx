import React, { useEffect, useState } from 'react';
import './BreederCard.scss';
import { Avatar, Card, Col, Row, Typography, message } from 'antd';
import FormatMoney from '../../utils/FormatMoney';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import RegisterWallPopup from '../../popups/RegisterWall/RegisterWallPopup';
import { getToken } from '../../utils/authHelpers';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { useUserContext } from '../../context/UserContext';

interface BreederCardProps {
	id: number;
	name: string;
	previewUrl: string;
	ownerId?: number;
	ownerName: string;
	ownerProfileImageUrl: string;
	pricing: number;
	favorite?: boolean;
}

const BreederCard: React.FC<BreederCardProps> = ({
	id,
	name,
	previewUrl,
	ownerId,
	ownerName,
	ownerProfileImageUrl,
	pricing,
	favorite
}) => {
	const { user } = useUserContext();
	const [saved, setSaved] = useState<boolean>(favorite || false);
	const [auth] = useState<boolean>(getToken() !== '' ? true : false);
	const [openRegisterWall, setOpenRegisterWall] = useState<boolean>(false);
	const navigate = useNavigate();

	// generate random images
	const fileNames = ['corgie', 'dash', 'golden', 'hairy', 'poodle'];
	const randomIndex = Math.floor(Math.random() * fileNames.length);
	const randomVector = fileNames[randomIndex];
	const defaultPreviewImage = require(`../../assets/images/vectors/${randomVector}.png`);

	useEffect(() => {
		const loadInitValues = () => {
			if (!user || favorite) return;
			if (!Array.isArray(user.favorites) || !user.favorites.length) return;
			setSaved(user.favorites.some(e => e.animal.id  === id))
		}
		loadInitValues()
		// eslint-disable-next-line
	}, [user, id]);

	const viewBreeder = () => {
		if (!ownerId) return;
		if (auth) {
			navigate(`/breeder/${ownerId}`);
		} else {
			setOpenRegisterWall(true);
		}
	};

	const viewAnimal = () => {
		if (!id) return;
		if (auth) {
			navigate(`/animal/${id}`);
		} else {
			setOpenRegisterWall(true);
		}
	};

	const onSave = async () => {
		if (!id) return;
		if (!user) return;
		try {
			const saveAnimal = await axios.post(`${API_URL}/favorites`, {
				data: {
					animal: id,
					user: user.id
				}
			});
			if (saveAnimal) {
				message.success('Successfully added to favorites.');
				setSaved(!saved);
			}
		} catch (error) {
			message.error(`Failed to add to saved list.`)
		}
	};

	return (
		<Card
			className="breederCard"
			bordered={false}
			cover={<Image className="breederCardImg" alt="breeder preview" src={previewUrl ? previewUrl : defaultPreviewImage} />}
			hoverable
		>
			<div className="breederCardContent">
				<Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
					<Col span={18}>
						<Typography.Title onClick={viewAnimal} className="breederCardName" level={4}>
							{name}
						</Typography.Title>
					</Col>
					{user && <Col className="breederCardLikeCta" span={user.isBuyer ? 6 : 0}>
						<i onClick={onSave} className={`ri-heart-${saved ? `fill saved` : `line`} ri-lg`}></i>
					</Col>}
					<Col span={24}>
						<Row align={'middle'} justify={'space-between'}>
							<Col onClick={viewBreeder} md={16} lg={16} xl={16} xxl={16}>
								<div className="ownerInfoRow">
									<Avatar shape="circle" src={ownerProfileImageUrl ? ownerProfileImageUrl : require(`../../assets/images/vectors/${randomVector}.png`)} />
									<Typography.Title type="secondary" className="ownerName" level={5}>
										{ownerName}
									</Typography.Title>
								</div>
							</Col>
							<Col onClick={viewBreeder} md={8} lg={8} xl={8} xxl={8} className="pricingContent">
								<Typography.Title level={5} className="pricingText">
									{FormatMoney(pricing)}
								</Typography.Title>
							</Col>
						</Row>
					</Col>
				</Row>
				<RegisterWallPopup
					opened={openRegisterWall}
					onCancel={() => setOpenRegisterWall(false)}
					onForceCb={() => console.log('object')}
				/>
			</div>
		</Card>
	);
};

export default BreederCard;
