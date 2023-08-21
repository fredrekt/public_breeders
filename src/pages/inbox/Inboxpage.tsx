import React, { useEffect, useRef, useState } from 'react';
import './Inboxpage.scss';
import PrivateLayout from '../../layouts/private/PrivateLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Avatar, Badge, Button, Col, ConfigProvider, Empty, Input, List, Result, Row, Typography, message } from 'antd';
import Moment from 'react-moment';
import { useLocalStorage } from 'usehooks-ts';
import io from 'socket.io-client';
import { API_BASE_URL, API_URL } from '../../utils/constant';
import { Model } from '../../models/model';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import MessageBlock from '../../components/MessageBlock/MessageBlock';
import { randomVector } from '../../utils/randomVector';

const socket = io(API_BASE_URL); //Connecting to Socket.io backend

const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
	let timeoutId: NodeJS.Timeout;
	return (...args: Parameters<F>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
};

const Inboxpage: React.FC = () => {
	const { user } = useUserContext();
	const [selectedConversationId, setSelectedConversationId] = useLocalStorage<number>('selectedConversationId', 0);
	const [selectedConversation, setSelectedConversation] = useState<Model.Conversation | null>(null);
	const [inboxData, setInboxData] = useState<Model.Conversation[]>([]);
	const [messageInput, setMessageInput] = useState<string>('');
	const [searchInboxTxt, setSearchInboxTxt] = useState<string>('');
	const [forceUpdate, setForceUpdate] = useState<boolean>(false);
	const dialogueContainer = useRef<HTMLDivElement>(null);
	const [currentViewportDate, setCurrentViewportDate] = useState<string | null>(null);

	const handleViewportChange = () => {
		if (!dialogueContainer.current) return;

		const visibleMessages = dialogueContainer.current.querySelectorAll('.messageBlock');
		const visibleMessageBlocks = [];

		for (let i = 0; i < visibleMessages.length; i++) {
			const messageBlock = visibleMessages[i] as HTMLElement;
			const rect = messageBlock.getBoundingClientRect();

			// Check if the message block is within the viewport
			if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
				visibleMessageBlocks.push(messageBlock);
			}
		}

		if (visibleMessageBlocks.length > 0) {
			const lastVisibleMessageBlock = visibleMessageBlocks[visibleMessageBlocks.length - 1];
			const messageDate: any = lastVisibleMessageBlock.dataset.messageDate;
			setCurrentViewportDate(messageDate);
		} else {
			setCurrentViewportDate(null);
		}
	};

	const debouncedHandleViewportChange = debounce(handleViewportChange, 100); // Debounce scroll events

	useEffect(() => {
		loadSocketMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			const res = (await axios.get(`${API_URL}/conversations`)).data;
			setInboxData(res);
			if (Array.isArray(res) && res.length) {
				if (selectedConversationId) {
					let conversation = res.filter((data: Model.Conversation) => data.id === selectedConversationId);
					setSelectedConversation(conversation[0]);
					setSelectedConversationId(conversation[0].id);
				} else {
					setSelectedConversation(res[0]);
					setSelectedConversationId(res[0].id);
				}
			}
		} catch (error) {
			message.error(`Something wen't wrong in getting conversations.`);
		}
	};

	const loadSocketMessages = async () => {
		socket.on('welcome', (data: any) => {
			console.log('opened conversation');
		});

		socket.on('newMessage', async (data: any, error) => {
			setSelectedConversation((prevConversation) => {
				if (
					prevConversation &&
					prevConversation.id === data.conversation &&
					prevConversation.messages.every((message) => message.id !== data.id)
				) {
					const updatedMessages = [...prevConversation.messages, data];
					return {
						...prevConversation,
						messages: updatedMessages,
						updatedAt: data.updatedAt // Assuming the backend sends the createdAt property for the new message
					};
				}
				return prevConversation;
			});
		});

		if (selectedConversationId) {
			socket.emit('joinConversation', selectedConversationId);
		}

		return () => {
			socket.disconnect();
		};
	};

	const renderInboxHeader = () => {
		if (!selectedConversation || !user) return;
		return (
			<div className="inboxConversationHeader">
				<Typography.Title className="inboxConversationHeaderTxt">
					{user.isBuyer
						? selectedConversation.receiver.breeder.businessName
						: `${selectedConversation.sender.firstName} ${selectedConversation.sender.lastName}`}
				</Typography.Title>
				{user.isBuyer && (
					<Typography.Paragraph>{selectedConversation.receiver.breeder.aboutBusiness}</Typography.Paragraph>
				)}
				<div className="conversationStatusContainer">
					<Badge
						dot
						className="conversationStatusColor"
						status={selectedConversation.id ? 'success' : 'default'}
					/>
					<Typography.Text className="conversationStatusTxt">
						{selectedConversation.id ? `Active Now` : 'Offline'}
					</Typography.Text>
				</div>
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
					placeholder="Write a message..."
					rows={5}
					value={messageInput}
					onChange={(e: any) => setMessageInput(e.target.value)}
					onKeyDown={(e: any) => {
						if (e.key === 'Enter') {
							onSendMessage();
						}
					}}
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
				extra={
					<Link to="/">
						<Button type="primary">Find {user.isBuyer ? `breeders` : 'buyers'}</Button>
					</Link>
				}
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
	};

	const onSendMessage = async () => {
		if (!selectedConversation || !user) return;
		if (!messageInput) {
			message.error(`Please enter your message.`);
			return;
		}
		try {
			socket.emit(
				'sendMessage',
				{
					message: messageInput,
					conversation: selectedConversation.id,
					sender: user.id
				},
				(error: any) => {
					if (error) {
						message.error(`Something wen't wrong in sending a message.`);
					}
				}
			);
			setMessageInput('');
			setForceUpdate(!forceUpdate);
		} catch (error) {
			message.error(`Something wen't wrong in sending a message.`);
		}
	};

	const filterSearchInbox = (text: string, searchText: string) => {
		if (!text) return;
		return text.toLowerCase().includes(searchText.toLowerCase());
	};

	const renderInbox = () => {
		if (!user) return;
		let inboxDataList = inboxData;

		if (searchInboxTxt) {
			if (user.isBuyer) {
				const filteredInboxData = inboxData.filter(({ receiver }) => {
					const { businessName, registryName, prefix } = receiver.breeder;
					return (
						filterSearchInbox(businessName, searchInboxTxt) ||
						filterSearchInbox(registryName, searchInboxTxt) ||
						filterSearchInbox(prefix, searchInboxTxt)
					);
				});
				inboxDataList = filteredInboxData;
			} else {
				const filteredInboxData = inboxData.filter(({ sender }) => {
					const { email, firstName, lastName } = sender;
					return (
						filterSearchInbox(email, searchInboxTxt) ||
						filterSearchInbox(firstName, searchInboxTxt) ||
						filterSearchInbox(lastName, searchInboxTxt)
					);
				});
				inboxDataList = filteredInboxData;
			}
		}

		return (
			<ConfigProvider renderEmpty={() => <Empty description="No messages" />}>
				<div className="inboxSearchContainer">
					<Input
						value={searchInboxTxt}
						onChange={(e: any) => setSearchInboxTxt(e.target.value)}
						size="large"
						className="inboxSearch"
						placeholder="Search messages"
						prefix={<i className="ri-search-line"></i>}
					/>
				</div>
				<List
					itemLayout="horizontal"
					dataSource={inboxDataList}
					renderItem={(item, index) => (
						<List.Item
							onClick={() => onChangeConversation(item)}
							className={`inboxListItem ${item.id === selectedConversationId ? `selected` : ''}`}
						>
							<List.Item.Meta
								avatar={
									<Avatar
										size={64}
										src={
											user.isBuyer
												? item.receiver.breeder.avatar?.url
												: item.sender.avatar?.url ||
												  require(`../../assets/images/vectors/${randomVector}.png`)
										}
									/>
								}
								title={
									<span className="inboxItemTitleContainer">
										<span className="inboxItemTitleName">
											{user.isBuyer
												? item.receiver.breeder.businessName
												: `${item.sender.firstName} ${item.sender.lastName}`}
										</span>
										<span className="inboxItemTitleDate">
											<Moment fromNow ago>
												{item.updatedAt}
											</Moment>
										</span>
									</span>
								}
								description={item.messages[item.messages.length - 1].message}
							/>
						</List.Item>
					)}
				/>
			</ConfigProvider>
		);
	};

	const renderSelectedConversation = () => {
		if (!selectedConversationId || !selectedConversation || !user) return null;
		if (!Array.isArray(selectedConversation.messages) || !selectedConversation.messages.length) return null;

		return selectedConversation.messages.map((message) => (
			<MessageBlock key={message.id} right={message.sender.id === user.id} message={message} />
		));
	};

	useEffect(() => {
		const currentContainer = dialogueContainer.current;
		if (currentContainer) {
			currentContainer.addEventListener('scroll', debouncedHandleViewportChange);
		}

		return () => {
			if (currentContainer) {
				currentContainer.removeEventListener('scroll', debouncedHandleViewportChange);
			}
		};
	}, [selectedConversationId, selectedConversation, debouncedHandleViewportChange]);

	const renderSelectedViewDate = () => {
		if (!currentViewportDate) return null;

		const currentDate = new Date();
		const viewportDate = new Date(currentViewportDate);

		if (
			currentDate.getFullYear() === viewportDate.getFullYear() &&
			currentDate.getMonth() === viewportDate.getMonth() &&
			currentDate.getDate() === viewportDate.getDate()
		) {
			return <div className="selectedViewingDate">Today</div>;
		}

		return (
			<div className="selectedViewingDate">
				<Moment format="MMMM DD, YYYY" fromNow>
					{currentViewportDate}
				</Moment>
			</div>
		);
	};

	return (
		<PrivateLayout className="inboxPage customLayoutWidth">
			<PageTitle title="Inbox" />
			<Row className="inboxContent">
				<Col xs={24} sm={24} md={9} className="inboxList" lg={6} xl={6} xxl={6}>
					{renderInbox()}
				</Col>
				<Col xs={24} sm={24} md={15} lg={18} xl={18} xxl={18}>
					<div className="inboxConversation">
						{renderInboxHeader()}
						<div
							onScroll={handleViewportChange}
							ref={dialogueContainer}
							className={`inboxConversationContent ${
								selectedConversation ? 'conversationContent' : 'emptyConversation'
							}`}
						>
							{renderSelectedViewDate()}
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
