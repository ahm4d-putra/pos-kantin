import { useState } from "react";
import { createTransaksi } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

const useTransaksi = () => {
  const { user } = useAuth();
  const [keranjang, setKeranjang] = useState([]);
  const [bayar, setBayar] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataStruk, setDataStruk] = useState(null);
  const [showStruk, setShowStruk] = useState(false);

  const addToCart = (item) => {
    const exist = keranjang.find((k) => k.id === item.id);
    if (exist) {
      if (exist.jumlah >= item.stok) return alert("Stok tidak mencukupi!");
      setKeranjang(
        keranjang.map((k) =>
          k.id === item.id
            ? { ...k, jumlah: k.jumlah + 1, subtotal: (k.jumlah + 1) * k.harga }
            : k,
        ),
      );
    } else {
      if (item.stok === 0) return alert("Stok habis!");
      setKeranjang([
        ...keranjang,
        { ...item, jumlah: 1, subtotal: item.harga, stokAwal: item.stok },
      ]);
    }
  };

  const increaseQty = (id, stokSekarang) => {
    const item = keranjang.find((k) => k.id === id);
    if (item.jumlah >= stokSekarang) return alert("Stok tidak mencukupi!");
    setKeranjang(
      keranjang.map((k) =>
        k.id === id
          ? { ...k, jumlah: k.jumlah + 1, subtotal: (k.jumlah + 1) * k.harga }
          : k,
      ),
    );
  };

  const decreaseQty = (id) => {
    const item = keranjang.find((k) => k.id === id);
    if (item.jumlah === 1) {
      setKeranjang(keranjang.filter((k) => k.id !== id));
    } else {
      setKeranjang(
        keranjang.map((k) =>
          k.id === id
            ? { ...k, jumlah: k.jumlah - 1, subtotal: (k.jumlah - 1) * k.harga }
            : k,
        ),
      );
    }
  };

  const removeFromCart = (id) =>
    setKeranjang(keranjang.filter((k) => k.id !== id));
  const total = keranjang.reduce((acc, curr) => acc + curr.subtotal, 0);
  const kembalian = bayar ? Number(bayar) - total : 0;

  const handleCheckout = async () => {
    if (keranjang.length === 0) return alert("Keranjang kosong!");
    if (!bayar || Number(bayar) < total) return alert("Uang bayar kurang!");

    setLoading(true);
    try {
      const trxId = await createTransaksi({
        items: keranjang,
        total,
        bayar: Number(bayar),
        kembalian,
        kasirId: user.uid,
        kasirNama: user.email,
      });
      setDataStruk({
        id: trxId,
        items: keranjang,
        total,
        bayar: Number(bayar),
        kembalian,
        kasir: user.email,
        tanggal: new Date(),
      });
      setShowStruk(true);
      setKeranjang([]);
      setBayar("");
    } catch (err) {
      console.error(err);
      alert("Transaksi gagal!");
    }
    setLoading(false);
  };

  return {
    keranjang,
    bayar,
    setBayar,
    total,
    kembalian,
    loading,
    showStruk,
    dataStruk,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    handleCheckout,
    setShowStruk,
  };
};

export default useTransaksi;
