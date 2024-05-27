// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setData(items);
    setLoading(false);
  };

  const addData = async (newData) => {
    await addDoc(collection(db, collectionName), newData);
    fetchData(); // Fetch data again to update the list
  };

  return { data, loading, fetchData, addData };
};

export default useFirestore;
