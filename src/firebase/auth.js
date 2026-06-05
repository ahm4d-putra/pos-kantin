import { initializeApp } from "firebase/app"; // Perbaikan: initializeApp dipisah ke sini
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, firebaseConfig } from "./config";

// === LOGIN & LOGOUT UTAMA ===
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

// === FITUR REGISTER (Bikin Akun Kasir/Admin Baru) ===
// Trick: Gunakan Secondary App agar Admin tidak logout saat membuat akun baru
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export const registerNewUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth,
    email,
    password,
  );
  // Langsung logout dari secondary auth setelah membuat akun
  await signOut(secondaryAuth);
  return userCredential;
};
