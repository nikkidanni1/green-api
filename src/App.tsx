import React, { useState, useCallback, useEffect } from 'react';
import styles from './App.module.css';
import AuthScreen from './components/AuthScreen/AuthScreen';
import ChatScreen from './components/ChatScreen/ChatScreen';
import { sendTextMessage, receiveNotification } from './services/chatService';
import { ApiCredentials, Message } from './types';
import { isDuplicateMessage, mapNotificationToMessage } from './utils';

const App: React.FC = () => {
  const [credentials, setCredentials] = useState<ApiCredentials | null>(null);
  const [targetPhone, setTargetPhone] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!credentials || !targetPhone) {
      return;
    }

    let cancelled = false;

    const pollMessages = async () => {
      while (!cancelled) {
        try {
          const res = await receiveNotification(credentials);

          if (cancelled) {
            break;
          }

          const message = mapNotificationToMessage(res, targetPhone);

          if (message) {
             setMessages((prev) => {
              if (isDuplicateMessage(prev, message)) {
                return prev;
              }

              return [...prev, message];
            });
          }
        } catch (error) {
          if (!cancelled) {
            console.error('Ошибка получения сообщений:', error);
          }
        }
      }
    };

    pollMessages();

    return () => {
      cancelled = true;
    };
  }, [credentials, targetPhone]);

  const handleLogin = useCallback((idInstance: string, apiTokenInstance: string) => {
    if (idInstance && apiTokenInstance) {
      setCredentials({ idInstance, apiTokenInstance });
      setTargetPhone(''); 
    } else {
      alert('Пожалуйста, предоставьте как ID Instance, так и API Token Instance.');
    }
  }, []);

  const handleResetPhone = useCallback(() => {
    setTargetPhone('');
    setMessages([]);
  }, []);

  const handleLogout = useCallback(() => {
    setCredentials(null);
    handleResetPhone();
  }, [handleResetPhone]);

  const onTargetPhoneChange = useCallback((phone: string) => {
    setTargetPhone(phone)
  }, []);

  const onSendMessage = useCallback(async (message: string) => {
    if (!message || !credentials || !targetPhone) {
      console.warn('Невозможно отправить сообщение: сообщение пустое, пользователь не авторизован или не указан целевой номер.');
      return;
    }

    try {
      const res = await sendTextMessage(credentials, targetPhone, message);
      const newMessage: Message = {
        id: res.idMessage,
        text: message,
        sender: 'me'
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setMessages(prevMessages => prevMessages.slice(0, -1));
    }
  }, [targetPhone, credentials]);

  return (
    <div className={styles.appContainer}>
      {!credentials ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <div className={styles.chatContainer}>
          <header className={styles.header}>
            <h2>Чат {credentials?.idInstance} {targetPhone && `(с ${targetPhone})`}</h2> 
            <div className={styles.headerActions}>
              <button className={styles.changeNumberButton} onClick={handleResetPhone}>
                Сменить номер
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </header>
          <ChatScreen
            messages={messages}
            targetPhone={targetPhone} 
            onTargetPhoneChange={onTargetPhoneChange}
            onSendMessage={onSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default App;
