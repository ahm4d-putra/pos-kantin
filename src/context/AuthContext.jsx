import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole } from "../firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [nama, setNama] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);

  // Fungsi untuk refresh data profil setelah diedit
  const fetchUserProfile = async (uid) => {
    const userData = await getUserRole(uid);
    if (userData) {
      setRole(userData.role);
      setNama(userData.nama || "");
      setPhotoURL(userData.photoURL || "");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setRole(null);
        setNama("");
        setPhotoURL("");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, nama, photoURL, loading, fetchUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
