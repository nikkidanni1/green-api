export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
}

export interface ApiCredentials {
  idInstance: string;
  apiTokenInstance: string;
}
