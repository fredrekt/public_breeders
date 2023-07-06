import React, { useEffect, useRef, useState } from 'react';
import './Inboxpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Avatar, Button, Col, ConfigProvider, Empty, Input, List, Result, Row, Typography, message } from 'antd';
import Moment from 'react-moment';
import { useLocalStorage } from 'usehooks-ts';
// import socket from 'socket.io-client';
import { API_URL } from '../../utils/constant';
import { Model } from '../../models/model';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import MessageBlock from '../../components/MessageBlock/MessageBlock';

// const io = socket(API_BASE_URL); //Connecting to Socket.io backend

const Inboxpage: React.FC = () => {
	const { user } = useUserContext();
	const [selectedConversationId, setSelectedConversationId] = useLocalStorage<number>('selectedConversationId', 0);
	const [selectedConversation, setSelectedConversation] = useState<Model.Conversation | null>(null);
	const [inboxData, setInboxData] = useState<Model.Conversation[]>([]);
	const [messageInput, setMessageInput] = useState<string>('');
	const [forceUpdate, setForceUpdate] = useState<boolean>(false);
	const dialogueContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		loadConversation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedConversationId, forceUpdate]);

	useEffect(() => {
		loadInbox();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, forceUpdate]);

	useEffect(() => {
		scrollToBottom();
	  }, [selectedConversationId, selectedConversation]);

	const loadInbox = async () => {
		if (!user) return;
		try {
			const res = (await axios(`${API_URL}/conversations`)).data;
			setInboxData(res);
			if (Array.isArray(res) && res.length) {
				setSelectedConversation(res[0]);
				setSelectedConversationId(res[0].id);
			}
		} catch (error) {
			message.error(`Something wen't wrong in getting conversations.`)
		}
	};

	const loadConversation = async () => {
		if (!selectedConversationId) return;
		// setSelectedConversation(selectedConversationId);
		// message.success(`Successfully loaded conversation: ${selectedConversationId}`);
		console.log(selectedConversation);
	};

	const renderInboxHeader = () => {
		if (!selectedConversation || !user) return;
		return (
			<div className="inboxConversationHeader">
				<Typography.Title className="inboxConversationHeaderTxt">
					{user.isBuyer ? selectedConversation.receiver.breeder.businessName : `${selectedConversation.sender.firstName} ${selectedConversation.sender.lastName}`}
				</Typography.Title>
				{user.isBuyer && <Typography.Paragraph>
					{selectedConversation.receiver.breeder.aboutBusiness}
				</Typography.Paragraph>}
			</div>
		);
	};

	const renderInboxFooter = () => {
		if (!selectedConversation) return;
		return (
			<div className="inboxConversationCta">
				<Input.TextArea
					className="inboxConversationInput"
					bordered={false}
					style={{ resize: 'none' }}
					placeholder="Enter message"
					rows={5} value={messageInput}
					onChange={(e: any) => setMessageInput(e.target.value)}
				/>
				<Button
					className="inboxConversationSend"
					type="primary"
					icon={<i className="ri-send-plane-2-line"></i>}
					onClick={onSendMessage}
				>
					Send message
				</Button>
			</div>
		);
	};

	const renderEmptyConversation = () => {
		if (selectedConversation || !user) return;
		return (
			<Result
				status="info"
				title="Empty"
				subTitle="You don't have any conversations & messages yet."
				extra={<Link to="/"><Button type="primary">Find {user.isBuyer ? `breeders` : 'buyers'}</Button></Link>}
			/>
		);
	};

	const scrollToBottom = () => {
		if (dialogueContainer.current) {
			dialogueContainer.current.scrollTop = dialogueContainer.current.scrollHeight;
		}
	  };

	const onChangeConversation = (conversation: Model.Conversation) => {
		setSelectedConversationId(conversation.id);
		setSelectedConversation(conversation);
	}

	const onSendMessage = async () => {
		if (!selectedConversation || !user) return;
		try {
			const res = (await axios.post(`${API_URL}/messages`, {
				data: {
					message: messageInput,
					conversation: selectedConversation.id,
					sender: user.id
				}
			})).data;
			if (res) {
				setMessageInput('');
				setForceUpdate(!forceUpdate);
			}
		} catch (error) {
			message.error(`Something wen't wrong in sending a message.`);
		}
	}
 
	const renderInbox = () => {
		if (!user) return;
		return (
			<ConfigProvider renderEmpty={() => <Empty description="No messages" />}>
			<List
				itemLayout="horizontal"
				dataSource={inboxData}
				renderItem={(item, index) => (
					<List.Item
						onClick={() => onChangeConversation(item)}
						className={`inboxListItem ${item.id === selectedConversationId ? `selected` : ''}`}
					>
						<List.Item.Meta
							avatar={
								<Avatar
									src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
								/>
							}
							title={
								<span className="inboxItemTitleContainer">
									<span className="inboxItemTitleName">{user.isBuyer ? item.receiver.breeder.businessName : `${item.sender.firstName} ${item.sender.lastName}`}</span>
									<span className="inboxItemTitleDate">
										<Moment fromNow ago>
											{item.createdAt}
										</Moment>
									</span>
								</span>
							}
							description={item.messages[0].message}
						/>
					</List.Item>
				)}
			/>
		</ConfigProvider>
		)
	}

	const renderSelectedConversation = () => {
		if (!selectedConversationId || !selectedConversation || !user) return;
		if (!Array.isArray(selectedConversation.messages) || !selectedConversation.messages.length) return;
		const dialogue = [];
		for (let message of selectedConversation.messages) {
			if (message.sender.id === user.id) {
				dialogue.push(<MessageBlock right message={message} />)
			} else {
				dialogue.push(<MessageBlock message={message} />)
			}
		}
		return dialogue;
	}

	return (
		<PrivateLayout className="inboxPage customLayoutWidth">
			<PageTitle title="Inbox" />
			<Row className="inboxContent">
				<Col className="inboxList" lg={6}>
					{renderInbox()}
				</Col>
				<Col lg={18}>
					<div className="inboxConversation">
						{renderInboxHeader()}
						<div ref={dialogueContainer} className={`inboxConversationContent ${selectedConversation ? 'conversationContent' : 'emptyConversation'}`}>
							{renderSelectedConversation()}
							{renderEmptyConversation()}
						</div>
						{renderInboxFooter()}
					</div>
				</Col>
			</Row>
		</PrivateLayout>
	);
};

export default Inboxpage;
