import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR4do1CWpDXauEH-o9N3EGGFQHSFlmivQ",
  authDomain: "balaji-koneti-task-manager.firebaseapp.com",
  projectId: "balaji-koneti-task-manager",
  storageBucket: "balaji-koneti-task-manager.firebasestorage.app",
  messagingSenderId: "1018179316348",
  appId: "1:1018179316348:web:fe4e427b626f9a1f8277f9",
  measurementId: "G-1K0MB2R51T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 