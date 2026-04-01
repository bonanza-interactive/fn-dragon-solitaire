const STORAGE_KEY = 'card-game-kit';
const SETTINGS: Record<string, VersionedValue> = loadSettings();
const LISTENERS: Map<string, Set<Listener>> = new Map();

type VersionedValue = {
  version: number;
  value: JsonValue;
};

type JsonValue = boolean | number | string | null | JsonArray | JsonObject;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

type Listener = (v: JsonValue | undefined) => void;

function loadSettings(): typeof SETTINGS {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) {
    return {};
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

function getStoredValue<T extends JsonValue>(
  key: string,
  version: number,
  defaultValue: T,
): T {
  const storedValue = SETTINGS[key];
  return storedValue?.version === version
    ? (storedValue.value as T)
    : defaultValue;
}

export function useSetting<T extends JsonValue>(
  key: string,
  version: number,
  defaultValue: T,
): [T, (newValue: T) => void] {
  const setter = (value: T) => {
    SETTINGS[key] = {version, value};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SETTINGS));
  };

  return [getStoredValue(key, version, defaultValue), setter];
}

export function resetSettings(): void {
  for (const key of Object.keys(SETTINGS)) {
    delete SETTINGS[key];
  }
  localStorage.removeItem(STORAGE_KEY);

  for (const listeners of LISTENERS.values()) {
    for (const listener of listeners) {
      listener(undefined);
    }
  }
}
