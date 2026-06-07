import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateEmail,
} from "firebase/auth"; // Tambahkan updateEmail
import { auth, firebaseConfig } from "./config";

// === LOGIN & LOGOUT UTAMA ===
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

// === FITUR REGISTER ===
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export const registerNewUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth,
    email,
    password,
  );
  await signOut(secondaryAuth);
  return userCredential;
};

// === UPDATE EMAIL ===
export const updateUserEmailAuth = async (user, newEmail) => {
  return await updateEmail(user, newEmail);
};
