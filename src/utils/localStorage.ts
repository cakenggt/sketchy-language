export const enum StorageKey {
  Progress = "PROGRESS",
}

const STORAGE = window.localStorage;

export const getItem = (key: StorageKey) => {
  try {
    return JSON.parse(STORAGE.getItem(key));
  } catch {
    return null;
  }
};

export const setItem = (key: StorageKey, value: string) => {
  STORAGE.setItem(key, value);
};
