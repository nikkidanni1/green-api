import React from 'react';
import styles from './ChatScreen.module.css';
import { Message } from '../../types';

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isMe = message.sender === 'me';
  return (
    <div className={`${styles.messageContent} ${isMe ? styles.senderMe : styles.senderOther} ${styles.messageBubble}`}>
      {message.text}
    </div>
  );
};

export default MessageBubble;