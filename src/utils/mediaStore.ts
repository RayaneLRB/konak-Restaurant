const DB = 'konak_media';
const STORE = 'files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function isMediaRef(v?: string | null): boolean {
  return !!v && v.startsWith('idb:');
}

export async function storeMedia(file: Blob, onProgress?: (p: number) => void): Promise<string> {
  onProgress?.(30);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(file, id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
  onProgress?.(100);
  return `idb:${id}`;
}

export async function getMediaBlob(ref: string): Promise<Blob | null> {
  if (!isMediaRef(ref)) return null;
  const id = ref.slice(4);
  const db = await openDB();
  const blob = await new Promise<Blob | null>((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const r = tx.objectStore(STORE).get(id);
    r.onsuccess = () => res(r.result ?? null);
    r.onerror = () => rej(r.error);
  });
  db.close();
  return blob;
}

export async function deleteMedia(ref: string): Promise<void> {
  if (!isMediaRef(ref)) return;
  const id = ref.slice(4);
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}
