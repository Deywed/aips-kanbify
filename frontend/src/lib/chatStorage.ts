const STORAGE_KEY = 'chat_state';

type ChatEntry = {
  lastSeenAt: string;
};

type ChatState = Record<string, ChatEntry>;

const buildKey = (boardId: string, userId: string) => `${boardId}:${userId}`;

const readState = (): ChatState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeState = (state: ChatState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const chatStorage = {
  getLastSeenAt(boardId: string, userId: string): string | null {
    const state = readState();
    return state[buildKey(boardId, userId)]?.lastSeenAt ?? null;
  },

  updateLastSeenAt(boardId: string, userId: string, timestamp?: string) {
    const state = readState();

    const adjustedTime = timestamp
      ? new Date(new Date(timestamp).getTime() + 1).toISOString()
      : new Date().toISOString();

    state[buildKey(boardId, userId)] = {
      lastSeenAt: adjustedTime,
    };
    writeState(state);
  },
};
