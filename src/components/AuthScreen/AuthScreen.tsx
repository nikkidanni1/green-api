import React, { useState, useCallback } from 'react';
import styles from './AuthScreen.module.css';

interface AuthScreenProps {
  onLogin: (id: string, token: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [idInstance, setIdInstance] = useState<string>('');
  const [apiTokenInstance, setApiTokenInstance] = useState<string>('');

  const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIdInstance(e.target.value);
  }, []);

  const handleApiTokenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApiTokenInstance(e.target.value);
  }, []);

  const handleLoginClick = useCallback(() => {
    onLogin(idInstance, apiTokenInstance);
  }, [idInstance, apiTokenInstance, onLogin]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <div className={styles.formGroup}>
            <label htmlFor="idInstance" className={styles.label}>ID Instance</label>
            <input
              id="idInstance"
              type="text"
              value={idInstance}
              onChange={handleIdChange}
              className={styles.input}
              placeholder="Введите ID Instance"
            />
          </div >
          <div className={styles.formGroup}>
            <label htmlFor="apiTokenInstance" className={styles.label}>API Token Instance</label>
            <input
              id="apiTokenInstance"
              type="password"
              value={apiTokenInstance}
              onChange={handleApiTokenChange}
              className={styles.input}
              placeholder="Введите API Token Instance"
            />
          </div >
          <button type="button" onClick={handleLoginClick} className={styles.button}>
            Войти
          </button>
        </div>
      </div >
    </div >
  );
};

export default AuthScreen;