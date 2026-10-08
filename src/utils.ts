import { Message } from './types';

export const mapNotificationToMessage = (
  res: any,
  targetPhone: string
): Message | null => {
  const text = res?.messageData?.extendedTextMessageData?.text;

  if (
    res?.senderData?.chatId !== `${targetPhone}@c.us` ||
    !text ||
    !res?.idMessage
  ) {
    return null;
  }

  return {
    id: res.idMessage,
    text,
    sender: 'other',
  };
};

export const isDuplicateMessage = (
  messages: Message[],
  message: Message
): boolean => {
  return messages.some((item) => item.id === message.id);
};
