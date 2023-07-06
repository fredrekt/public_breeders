import React from 'react';
import './MessageBlock.scss';
import { Model } from '../../models/model';
import { Avatar, Typography } from 'antd';
import Moment from 'react-moment';
import { randomVector } from '../../utils/randomVector';

interface MessageBlockProps {
    message: Model.Message;
    right?: boolean;
}

const MessageBlock: React.FC<MessageBlockProps> = ({ message, right }) => {
  return (
    <div className={`messageBlock ${right ? 'rightAlign' : ''}`}>
        <Avatar
            src={message.sender.avatar ? message.sender.avatar.url : require(`../../assets/images/vectors/${randomVector}.png`)}
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 64, xxl: 64 }}
        />
        <div className="messageBlockMeta">
            <div className="messageBlockMetaInfo">
                {message.sender && <b className='messageBlockUser'>{message.sender.firstName} {message.sender.lastName} {right ? '(You)' : ''}</b>}
                <small className="messageBlockDate">
                    <Moment date={message.createdAt} format="hh:mm A"/>
                </small>
            </div>
            <div className="messageBlockMsg">
                <Typography.Paragraph className='messageBlockTxt'>
                    {message.message}
                </Typography.Paragraph>
            </div>
        </div>
    </div>
  )
}

export default MessageBlock