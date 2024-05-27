// 新增的程式碼
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCAnvTiQQmxEKiJjy8nMnq-U7icE7hJFpE",
    authDomain: "fir-test-d6d71.firebaseapp.com",
    projectId: "fir-test-d6d71",
    storageBucket: "fir-test-d6d71.appspot.com",
    messagingSenderId: "287475617055",
    appId: "1:287475617055:web:a1e2c8110dc6511be7342a"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
