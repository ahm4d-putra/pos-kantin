import { db } from "./config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// === BARANG ===
export const getBarang = async () => {
  const snapshot = await getDocs(collection(db, "barang"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addBarang = async (data) => {
  return await addDoc(collection(db, "barang"), data);
};

export const updateBarang = async (id, data) => {
  return await updateDoc(doc(db, "barang", id), data);
};

export const deleteBarang = async (id) => {
  return await deleteDoc(doc(db, "barang", id));
};

// === UPLOAD GAMBAR (Opsional jika butuh) ===
export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          resolve(downloadURL),
        );
      },
    );
  });
};

// === TRANSAKSI ===
export const createTransaksi = async ({
  items,
  total,
  bayar,
  kembalian,
  kasirId,
  kasirNama,
}) => {
  const batch = writeBatch(db);
  const transaksiRef = doc(collection(db, "transaksi"));
  batch.set(transaksiRef, {
    kasirId,
    kasirNama,
    total,
    bayar,
    kembalian,
    createdAt: serverTimestamp(),
  });

  items.forEach((item) => {
    const detailRef = doc(collection(db, "detail_transaksi"));
    batch.set(detailRef, {
      transaksiId: transaksiRef.id,
      barangId: item.id,
      namaBarang: item.nama,
      harga: item.harga,
      jumlah: item.jumlah,
      subtotal: item.subtotal,
    });

    const barangRef = doc(db, "barang", item.id);
    batch.update(barangRef, {
      stok: item.stokAwal - item.jumlah,
    });
  });

  await batch.commit();
  return transaksiRef.id;
};

// === LAPORAN ===
export const getTransaksiByDate = async (startDate, endDate) => {
  const q = query(
    collection(db, "transaksi"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// === CHART PENJUALAN (7 HARI TERAKHIR) ===
export const getRecentTransaksi = async (days = 7) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, "transaksi"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// === DETAIL TRANSAKSI UNTUK LAPORAN ===
export const getDetailTransaksi = async (transaksiId) => {
  const q = query(
    collection(db, "detail_transaksi"),
    where("transaksiId", "==", transaksiId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// === USER ROLE ===
export const getUserRole = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) return docSnap.data();
  return null;
};

export const addUserToFirestore = async (uid, data) => {
  return await setDoc(doc(db, "users", uid), data);
};
