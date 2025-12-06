import { createContext, useContext, useEffect, useState } from "react";
const FirebaseContext = createContext(null);
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
} from "firebase/firestore";
// CONTEXT CODE ABOVE

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAZkqJ-BhXMQJShcrTIMIPzGULuri5Y65A",
    authDomain: "ecommerce-32dc5.firebaseapp.com",
    projectId: "ecommerce-32dc5",
    storageBucket: "ecommerce-32dc5.firebasestorage.app",
    messagingSenderId: "75523730256",
    appId: "1:75523730256:web:fc5827aba30a0f00e69a55",
    databaseURL: "https://ecommerce-32dc5-default-rtdb.firebaseio.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const db_realtime = getDatabase(firebaseApp);
const db_fireStore = getFirestore(firebaseApp);

const firebaseAuth = getAuth(firebaseApp);
const googleSignUp = new GoogleAuthProvider();

function FirebaseProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

    // User Login Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setCurrentUser(user);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setIsFirebaseLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Function - Store Data ( Realtime )
    const putData = (key, data) => set(ref(db_realtime, key), data);

    const insert_db_fireStore_userData = async (uid, data) => {
        if (!uid)
            throw new Error(
                "UID is required to insert user data into Firestore"
            );

        const profileToSave = {
            uid,
            ...data,
            updatedAt: new Date().toISOString(),
        };

        try {
            await setDoc(
                doc(db_fireStore, "users", uid, "Info", "profile"),
                profileToSave,
                { merge: true }
            );
            return profileToSave; // return saved object for confirmation
        } catch (err) {
            console.error("Firestore write failed:", err);
            throw err; // rethrow so caller sees it
        }
    };

    // Function - Create User
    const createUserInFirebase = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password);
    };

    // Function - SignUp with Google
    const signUpWithGoogle = () => {
        return signInWithPopup(firebaseAuth, googleSignUp);
    };

    const value = {
        // auth state
        currentUser, // Firebase user object or null
        isFirebaseLoading, // true while checking login status
        isLoggedIn,

        // database & auth helpers
        putData,
        insert_db_fireStore_userData,
        createUserInFirebase,
        signUpWithGoogle,
    };

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
}

//CONTEXT CODE BELOW
export function useFirebase() {
    return useContext(FirebaseContext);
}

export default FirebaseProvider;
