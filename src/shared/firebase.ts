import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

import configs from "./configs";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBhHEu4JlOv5NsmT2zVq-qu5kdn2f6Rb9U",
    authDomain: "socialhive-67b90.firebaseapp.com",
    projectId: "socialhive-67b90",
    storageBucket: "socialhive-67b90.appspot.com",
    messagingSenderId: "368805507783",
    appId: "1:368805507783:web:868c2add4736f2eb9a44e2",
    measurementId: "G-E75GP2M0ZT"
    };
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

enableIndexedDbPersistence(db, { forceOwnership: false });