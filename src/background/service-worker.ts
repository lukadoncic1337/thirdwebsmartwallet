import { ALARM_NAME, SESSION_KEY, DEFAULT_AUTO_LOCK_MINUTES, SETTINGS_KEY } from '../shared/constants';
import type { Message, MessageResponse } from '../services/messaging/MessageBus';

// Auto-lock setup
async function getAutoLockMinutes(): Promise<number> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return result[SETTINGS_KEY]?.autoLockMinutes ?? DEFAULT_AUTO_LOCK_MINUTES;
}

async function resetLockTimer() {
  await chrome.alarms.clear(ALARM_NAME);
  const minutes = await getAutoLockMinutes();
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: minutes });
}

async function lockWallet() {
  await chrome.storage.session.remove(SESSION_KEY);
}

// Alarm handler
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    lockWallet();
  }
});

// Message handler
chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse: (response: MessageResponse) => void) => {
    handleMessage(message).then(sendResponse);
    return true; // async response
  }
);

async function handleMessage(message: Message): Promise<MessageResponse> {
  switch (message.type) {
    case 'GET_AUTH_STATUS': {
      const session = await chrome.storage.session.get(SESSION_KEY);
      const hasSession = !!session[SESSION_KEY];
      const local = await chrome.storage.local.get('encrypted_privateKey');
      const hasWallet = !!local['encrypted_privateKey'];
      return {
        success: true,
        data: { hasSession, hasWallet },
      };
    }

    case 'SET_SESSION_KEY': {
      const key = message.payload as string;
      await chrome.storage.session.set({ [SESSION_KEY]: key });
      await resetLockTimer();
      return { success: true };
    }

    case 'GET_SESSION_KEY': {
      const session = await chrome.storage.session.get(SESSION_KEY);
      return { success: true, data: session[SESSION_KEY] || null };
    }

    case 'LOCK_WALLET': {
      await lockWallet();
      await chrome.alarms.clear(ALARM_NAME);
      return { success: true };
    }

    case 'RESET_LOCK_TIMER': {
      await resetLockTimer();
      return { success: true };
    }

    case 'CLEAR_SESSION': {
      await lockWallet();
      await chrome.alarms.clear(ALARM_NAME);
      return { success: true };
    }

    default:
      return { success: false, error: 'Unknown message type' };
  }
}
