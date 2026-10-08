import React, { useState, useRef, useEffect, useCallback } from 'react';

import styles from './ChatScreen.module.css';
import PhoneScreen from './PhoneScreen';
import MessageBubble from './MessageBubble';
import { Message } from '../../types';

interface ChatScreenProps {
  messages: Message[];
  targetPhone: string;
  onTargetPhoneChange: (number: string) => void;
  onSendMessage: (message: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, targetPhone, onTargetPhoneChange, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }, []);

  const handleSendMessage = useCallback(() => {
    onSendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, onSendMessage]);

  if (!targetPhone) {
    return (
      <div className={styles.chatWindow}>
        <div className={styles.contactInfo}>
          <PhoneScreen onSelectContact={onTargetPhoneChange} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer} role="log" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder={targetPhone ? `Сообщение для ${targetPhone}...` : "Введите сообщение"}
          className={styles.inputField}
          disabled={!targetPhone}
        />
        <button
          className={styles.sendButton}
          disabled={!inputMessage.trim() || !targetPhone}
          onClick={handleSendMessage}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
