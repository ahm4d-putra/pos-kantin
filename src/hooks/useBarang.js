import { useState, useEffect } from "react";
import { getBarang } from "../firebase/firestore";

const useBarang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const data = await getBarang();
      setBarang(data);
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBarang();
  }, []);
  return { barang, loading, fetchBarang };
};

export default useBarang;
