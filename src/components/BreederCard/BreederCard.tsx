import React, { useState } from 'react';
import './BreederCard.scss';
import { Avatar, Card, Col, Row, Typography, message } from 'antd';
import FormatMoney from '../../utils/FormatMoney';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import RegisterWallPopup from '../../popups/RegisterWall/RegisterWallPopup';

interface BreederCardProps {
	id: number;
	name: string;
	previewUrl: string;
	ownerName: string;
	ownerProfileImageUrl: string;
	pricing: string;
}

const BreederCard: React.FC<BreederCardProps> = ({
	id,
	name,
	previewUrl,
	ownerName,
	ownerProfileImageUrl,
	pricing
}) => {
	const [saved, setSaved] = useState<boolean>(false);
	const [auth] = useState<boolean>(false);
	const [openRegisterWall, setOpenRegisterWall] = useState<boolean>(false);
	const navigate = useNavigate();

	const viewBreeder = () => {
		if (!id) return;
		if (auth) {
			navigate(`/breeder/${id}`);
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
		message.success('Successfully added to favorites.');
		setSaved(!saved);
	};

	return (
		<Card
			className="breederCard"
			bordered={false}
			cover={<Image className="breederCardImg" alt="breeder preview" src={previewUrl} />}
			hoverable
		>
			<div className="breederCardContent">
				<Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
					<Col span={18}>
						<Typography.Title onClick={viewAnimal} className="breederCardName" level={4}>
							{name}
						</Typography.Title>
					</Col>
					<Col className="breederCardLikeCta" span={6}>
						<i onClick={onSave} className={`ri-heart-${saved ? `fill saved` : `line`} ri-lg`}></i>
					</Col>
					<Col span={24}>
						<Row align={'middle'} justify={'space-between'}>
							<Col onClick={viewBreeder} md={18} lg={18} xl={18} xxl={18}>
								<div className="ownerInfoRow">
									<Avatar shape="circle" src={ownerProfileImageUrl} />
									<Typography.Title type="secondary" className="ownerName" level={5}>
										{ownerName}
									</Typography.Title>
								</div>
							</Col>
							<Col onClick={viewBreeder} md={6} lg={6} xl={6} xxl={6} className="pricingContent">
								<Typography.Title level={5} className="pricingText">
									{FormatMoney(parseInt(pricing))}
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
