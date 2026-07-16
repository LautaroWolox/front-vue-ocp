import { EncryptStorage } from 'encrypt-storage';

const MIN_SECRET_KEY_LENGTH = 10;
const secretKey = import.meta.env.VITE_PARAMETER1?.trim();

if (!secretKey || secretKey.length < MIN_SECRET_KEY_LENGTH) {
  throw new Error(
    `[encrypt-storage] VITE_PARAMETER1 debe existir y tener al menos ${MIN_SECRET_KEY_LENGTH} caracteres.`
  );
}

/**
 * Única instancia de EncryptStorage para toda la aplicación.
 *
 * stateManagementUse evita que EncryptStorage haga JSON.parse del valor
 * persistido. Pinia necesita recibir el string serializado para hidratar el store.
 */
const encryptStorage = new EncryptStorage(secretKey, {
  storageType: 'sessionStorage',
  stateManagementUse: true,
});

const removeItem = (key) => {
  encryptStorage.removeItem(key);
};

const getRawItem = (key) => {
  try {
    const value = encryptStorage.getItem(key);
    return value == null ? null : String(value);
  } catch (error) {
    // Una clave cambiada o un valor viejo/corrupto no debe impedir que cargue la app.
    console.warn(`[encrypt-storage] Se descartó el valor inválido "${key}".`, error);
    removeItem(key);
    return null;
  }
};

/**
 * Adaptador compatible con pinia-plugin-persistedstate.
 * getItem siempre devuelve string | null, igual que Web Storage.
 */
export const piniaEncryptedSessionStorage = {
  getItem: getRawItem,
  setItem(key, value) {
    encryptStorage.setItem(key, String(value));
  },
  removeItem,
};

/**
 * Adaptador de uso general que conserva el comportamiento previo:
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
    encryptStorage.setItem(key, serializedValue);
  },
  removeItem,
};

// Se mantienen estos exports para no romper imports existentes.
export const storageAutenticado = parsedEncryptedSessionStorage;
export const storageUsuario = parsedEncryptedSessionStorage;
export const storageRutas = parsedEncryptedSessionStorage;
export const storageToken = parsedEncryptedSessionStorage;
export const auth = parsedEncryptedSessionStorage;
