import { SetStateAction, useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { fetchImageBlob, readBlob } from '../utils';

type DatabaseName = 'spacestagram-db';
type ObjectStoreName = 'spacestagram-store';

type IndexedDBObject = {
  uuid: string;
  imageBase64: string;
  srcURL: string | URL;
  liked: boolean;
};

type IndexedDBResult = {
  data: string;
  id: string;
};

type GetEntry = (id: string) => Promise<{ error: boolean; result: IndexedDBObject | {} }>;

const DB_NAME: DatabaseName = 'spacestagram-db';
const STORE_NAME: ObjectStoreName = 'spacestagram-store';

const useIndexexDB = (
  data?: any[]
): [
  IndexedDBObject[],
  {
    addEntry: (srcURL: string, id?: string) => void;
    deleteEntry: (id: string) => void;
    clearObjectStore: () => void;
    getEntry: GetEntry;
  },
  React.Dispatch<SetStateAction<any[]>>,
  IDBDatabase | null
] => {
  const [imagesData, setImagesData] = useState<IndexedDBObject[]>([]);
  const dbRef = useRef<IDBDatabase | null>(null);

  function transaction(storeName: ObjectStoreName, mode: IDBTransactionMode, callback?: Function) {
    if (dbRef.current instanceof IDBDatabase) {
      const db = dbRef.current;
      const tx = db.transaction([storeName], mode);
      tx.onerror = (event) => {
        console.error(event.target);
      };
      tx.oncomplete = (event) => {
        if (callback) callback(event);
      };
      const objectStore = tx.objectStore(storeName);
      return objectStore;
    } else {
      return undefined;
    }
  }

  function loadAllDataFromStore(objectStore: IDBObjectStore) {
    objectStore.getAll().onsuccess = (event) => {
      const { result } = event.target as IDBRequest;
      if (Array.isArray(result)) {
        const parsedData: IndexedDBObject[] = result.map((obj) => {
          const data = JSON.parse(obj.data);
          return data;
        });
        setImagesData(parsedData);
      }
    };
  }

  // initialize IndexedDB API
  useEffect(() => {
    try {
      const dbOpen = window.indexedDB.open(DB_NAME, 3);

      dbOpen.onerror = function (event) {
        console.error(event.target);
      };
      dbOpen.onblocked = function (event) {
        console.warn('db blocked, permissions may be needed by client');
      };
      dbOpen.onsuccess = function (event) {
        // set the debRef to the db instance
        const req = event.target as IDBRequest;
        const db = req.result as IDBDatabase;
        dbRef.current = db;

        const store = transaction(STORE_NAME, 'readonly');
        if (store) {
          // load all indexeddb data
          loadAllDataFromStore(store);
        }
      };
      dbOpen.onupgradeneeded = function (event) {
        const req = event.target as IDBRequest;
        const db = req.result as IDBDatabase;
        // Create an objectStore for this database
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
      };
    } catch (error) {
      console.log('Error Opening The IndexedDB');
      console.error(error);
    }
  }, []);

  const getEntry: GetEntry = (id) => {
    const returnObj = { error: false, result: {} };
    return new Promise((resolve, reject) => {
      if (dbRef.current instanceof IDBDatabase) {
        const objectStore = transaction('spacestagram-store', 'readonly');
        if (!objectStore) return;
        const get = objectStore.get(id);
        get.onsuccess = (event) => {
          const request = event.target as IDBRequest;
          const result: IndexedDBResult = request.result;
          if (result) {
            const dataObject: IndexedDBObject = JSON.parse(result.data);
            returnObj.result = dataObject;
            resolve(returnObj);
          } else {
            resolve(returnObj);
          }
        };
        get.onerror = () => {
          returnObj.error = true;
          reject(returnObj);
        };
      } else {
        reject(returnObj);
      }
    });
  };

  const addEntry = async (srcURL: string, id?: string) => {
    if (dbRef.current instanceof IDBDatabase) {
      if (id) {
        // check if id already exists
        const { error, result } = await getEntry(id);
        if (error || Object.keys(result).length > 0) return;
      }
      const res = await fetchImageBlob(srcURL);
      if (!res.blob) return;
      const response = await readBlob(res.blob);
      if (response.error) {
        console.error(response.error);
      }
      const dbObj: IndexedDBObject = {
        uuid: id || nanoid(),
        imageBase64: response.result,
        srcURL: srcURL,
        liked: true,
      };
      const data = JSON.stringify(dbObj);
      const objectStore = transaction('spacestagram-store', 'readwrite');
      if (!objectStore) return;
      objectStore.add({ data, id: dbObj.uuid }).onsuccess = () => {
        setImagesData((prev) => [...prev, dbObj]);
      };
    }
  };

  const deleteEntry = (id: string) => {
    if (dbRef.current instanceof IDBDatabase) {
      const objectStore = transaction('spacestagram-store', 'readwrite');
      if (!objectStore) return;
      objectStore.delete(id).onsuccess = () => {
        setImagesData((prev) => prev.filter((obj) => obj.uuid !== id));
      };
    }
  };

  function clearObjectStore() {
    if (dbRef.current instanceof IDBDatabase) {
      const objectStore = transaction('spacestagram-store', 'readwrite');
      if (!objectStore) return;
      objectStore.clear().onsuccess = () => {
        setImagesData([]);
      };
    }
  }

  return [imagesData, { addEntry, deleteEntry, clearObjectStore, getEntry }, setImagesData, dbRef.current];
};

export default useIndexexDB;
