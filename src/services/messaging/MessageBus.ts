export type MessageType =
  | 'LOCK_WALLET'
  | 'UNLOCK_WALLET'
  | 'GET_AUTH_STATUS'
  | 'RESET_LOCK_TIMER'
  | 'GET_SESSION_KEY'
  | 'SET_SESSION_KEY'
  | 'CLEAR_SESSION';

export interface Message {
  type: MessageType;
  payload?: unknown;
}

export interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export function sendMessage(message: Message): Promise<MessageResponse> {
  return chrome.runtime.sendMessage(message);
}
