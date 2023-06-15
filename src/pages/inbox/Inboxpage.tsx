import React, { useEffect, useState } from 'react';
import './Inboxpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Avatar, Button, Col, Input, List, Result, Row, Typography } from 'antd';
import { faker } from '@faker-js/faker';
import Moment from 'react-moment';
import { useLocalStorage } from 'usehooks-ts';

const Inboxpage: React.FC = () => {
	const [selectedConversationId, setSelectedConversationId] = useLocalStorage<number>('selectedConversationId', 0);
	const [selectedConversation, setSelectedConversation] = useState<any>(null);
	const [inboxData, setInboxData] = useState<any[]>([]);

	useEffect(() => {
		loadConversation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedConversationId]);

	useEffect(() => {
		loadInbox();
	}, []);

	const loadInbox = async () => {
		const data = [
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			},
			{
				title: faker.person.fullName()
			}
		];
		setInboxData(data);
	};

	const loadConversation = async () => {
		if (!selectedConversationId) return;
		setSelectedConversation(selectedConversationId);
		// message.success(`Successfully loaded conversation: ${selectedConversationId}`);
		console.log(selectedConversation);
	};

	return (
		<PrivateLayout className="inboxPage customLayoutWidth">
			<PageTitle title="Inbox" />
			<Row className="inboxContent">
				<Col className="inboxList" lg={6}>
					<List
						itemLayout="horizontal"
						dataSource={inboxData}
						renderItem={(item, index) => (
							<List.Item
								onClick={() => setSelectedConversationId(index)}
								className={`inboxListItem ${index === selectedConversationId ? `selected` : ''}`}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
										/>
									}
									title={
										<span className="inboxItemTitleContainer">
											<span className="inboxItemTitleName">{item.title}</span>
											<span className="inboxItemTitleDate">
												<Moment fromNow ago>
													{new Date()}
												</Moment>
											</span>
										</span>
									}
									description={faker.lorem.paragraphs(2)}
								/>
							</List.Item>
						)}
					/>
				</Col>
				<Col lg={18}>
					<div className="inboxConversation">
						<div className="inboxConversationHeader">
							<Typography.Title className="inboxConversationHeaderTxt">
								Breeder Conversation: {selectedConversationId}
							</Typography.Title>
						</div>
						<div className="inboxConversationContent">
							<Result
								status="404"
								title="404"
								subTitle="Sorry, the page you visited does not exist."
								extra={<Button type="primary">Back Home</Button>}
							/>
						</div>
						<div className="inboxConversationCta">
							<Input.TextArea placeholder="Enter message" rows={5} />
						</div>
					</div>
				</Col>
			</Row>
		</PrivateLayout>
	);
};

export default Inboxpage;
