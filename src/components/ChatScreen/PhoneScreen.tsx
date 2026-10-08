import React, { useState, useCallback } from 'react'; // <--- Добавлен useCallback
import styles from './ChatScreen.module.css';

interface PhoneScreenProps {
  onSelectContact: (number: string) => void;
}

const PhoneScreen: React.FC<PhoneScreenProps> = ({ onSelectContact }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const cleanDigits = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const handleSelect = useCallback(() => {
    if (!phoneNumber) {
      alert("Пожалуйста, введите номер телефона.");
      return;
    }

    onSelectContact(phoneNumber);
  }, [phoneNumber, onSelectContact]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cleanedValue = cleanDigits(newValue);
    setPhoneNumber(cleanedValue);
  }, []);

  return (
    <div className={styles.contactSelectionScreen}>
      <h2 className={styles.sectionTitle}>Выберите контакт для начала беседы</h2>
      <div className={styles.inputGroup}>
        <input
          type="tel"
          placeholder="Пример: 79991234567"
          className={styles.phoneNumberInput}
          value={phoneNumber}
          onChange={handleInputChange}
        />
        <button className={styles.selectButton} onClick={handleSelect}>
          Подключиться
        </button>
      </div >
    </div>
  );
};

export default PhoneScreen;
