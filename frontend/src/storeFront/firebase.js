import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAZkqJ-BhXMQJShcrTIMIPzGULuri5Y65A",
  authDomain: "ecommerce-32dc5.firebaseapp.com",
  projectId: "ecommerce-32dc5",
  storageBucket: "ecommerce-32dc5.firebasestorage.app",
  messagingSenderId: "75523730256",
  appId: "1:75523730256:web:fc5827aba30a0f00e69a55",
  databaseURL: "https://ecommerce-32dc5-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);