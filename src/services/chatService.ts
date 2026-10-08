import { BASE_API_URL } from '../constants';
import { ApiCredentials } from '../types';

const deleteNotification = async (credentials: ApiCredentials, receiptId: number): Promise<boolean> => {
  const { idInstance, apiTokenInstance } = credentials;
  const apiUrl = `${BASE_API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json().catch(() => ({ message: 'No response body' }));

    if (!response.ok) {
      console.error("API Error Response:", responseData);
      return false;
    }

    if (typeof responseData.result === 'boolean') {
      return responseData.result;
    } else {
      console.error("Unexpected response format from deleteNotification API.");
      return false;
    }
  } catch (error) {
    console.error("Error executing deleteNotification:", error);
    return false;
  }
};

export const receiveNotification = async (
  credentials: ApiCredentials, 
  receiveTimeoutSeconds: number = 5
) => {
  const { idInstance, apiTokenInstance } = credentials;
  const apiUrl = `${BASE_API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${receiveTimeoutSeconds}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status}. Details: ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();
    
    if (!data) {
      return data;
    }

    const success = await deleteNotification(credentials, data.receiptId);

    if (!success) {
      console.error("Successfully received notification, but failed to delete it from queue. Manual intervention required.");
    }

    return data.body;
  } catch (error) {
    console.error("Error receiving notification:", error);
    return null;
  }
};

export const sendTextMessage = async (
  credentials: ApiCredentials, 
  phone: string, 
  message: string
) => {
  const { idInstance, apiTokenInstance } = credentials;
  const apiUrl = `${BASE_API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
  
  const payload = {
    chatId: `${phone}@c.us`,
    message: message
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status}. Details: ${JSON.stringify(errorBody)}`);
    }
      
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};