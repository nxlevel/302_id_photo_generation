import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface IIDPhoto{
  id?: number;
  opacity_bg_image: string; // Transparent background ID photo
  id_photo_hd: string; // High definition ID photo
  six_inch_layout_photo: string; // Six inch layout photo
  created_at: string;
}

const DB_NAME = 'ai-id-photo-database';
const STORE_NAME = 'ai-id-photo-store';

// Number of entries per page
const PAGE_SIZE = 20;

interface MyDB extends DBSchema {
  [STORE_NAME]: {
    key: number;
    value: IIDPhoto
  };
}

export async function initDB(): Promise<IDBPDatabase<MyDB>> {
  const db = await openDB<MyDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function addData(data: IIDPhoto): Promise<IIDPhoto> {
  delete data.id;
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const id = await store.add(data);
  await tx.done;
  return { ...data, id };
}

export async function getData(quantity: number = PAGE_SIZE): Promise<IIDPhoto[]> {
  const db = await initDB();
  const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
  const allRecords = await store.getAll();
  //@ts-ignore
  allRecords.sort((a, b) => b.id - a.id);
  const endIndex = quantity + PAGE_SIZE;
  const paginatedData = allRecords.slice(0, endIndex);
  return paginatedData;
}

export async function deleteData(id: number): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
}