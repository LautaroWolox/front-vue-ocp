import CryptoJS from 'crypto-js';

const MIN_SECRET_KEY_LENGTH = 10;
const secretKey = import.meta.env.VITE_PARAMETER1?.trim();

if (!secretKey || secretKey.length < MIN_SECRET_KEY_LENGTH) {
  throw new Error(
    `[encrypted-storage] VITE_PARAMETER1 debe existir y tener al menos ${MIN_SECRET_KEY_LENGTH} caracteres.`
  );
}

const storage = window.sessionStorage;

const encrypt = (value) => CryptoJS.AES.encrypt(String(value), secretKey).toString();

const decrypt = (encryptedValue) => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  const value = bytes.toString(CryptoJS.enc.Utf8);

  if (!value) {
    throw new Error('No se pudo descifrar el valor almacenado.');
  }

  return value;
};

const removeItem = (key) => {
  storage.removeItem(key);
};

const getRawItem = (key) => {
  const encryptedValue = storage.getItem(key);

  if (encryptedValue === null) {
    return null;
  }

  try {
    return decrypt(encryptedValue);
  } catch (error) {
    // Una clave cambiada o un valor viejo/corrupto no debe impedir que cargue la app.
    console.warn(`[encrypted-storage] Se descartó el valor inválido "${key}".`, error);
    removeItem(key);
    return null;
  }
};

/**
 * Adaptador compatible con pinia-plugin-persistedstate.
 * Devuelve exactamente string | null, igual que Web Storage.
 */
export const piniaEncryptedSessionStorage = {
  getItem: getRawItem,
  setItem(key, value) {
    storage.setItem(key, encrypt(String(value)));
  },
  removeItem,
};

/**
 * Adaptador de uso general que conserva el comportamiento histórico:
 * objetos, booleanos y números vuelven a su tipo original al leerlos.
 */
const parsedEncryptedSessionStorage = {
  getItem(key) {
    const value = getRawItem(key);

    if (value === null) {
      return undefined;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  setItem(key, value) {
    const serializedValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    storage.setItem(key, encrypt(serializedValue));
  },
  removeItem,
};

// Se mantienen estos exports para no romper imports existentes.
export const storageAutenticado = parsedEncryptedSessionStorage;
export const storageUsuario = parsedEncryptedSessionStorage;
export const storageRutas = parsedEncryptedSessionStorage;
export const storageToken = parsedEncryptedSessionStorage;
export const auth = parsedEncryptedSessionStorage;
