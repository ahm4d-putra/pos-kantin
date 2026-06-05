import { useState, useEffect } from "react";
import { getBarang } from "../firebase/firestore";
import { formatRupiah } from "../utils/formatRupiah";
import { AlertTriangle } from "lucide-react";

const LaporanStok = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBarang();
      setBarang(data.sort((a, b) => a.stok - b.stok));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Laporan Stok Barang</h2>
      <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 flex items-center gap-3">
        <AlertTriangle /> Menandakan barang dengan stok kurang dari 5 (perlu
        restok).
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Nama Barang</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Sisa Stok</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Memuat...
                </td>
              </tr>
            ) : (
              barang.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b ${item.stok < 5 ? "bg-red-50" : ""}`}
                >
                  <td className="p-3 font-medium">{item.nama}</td>
                  <td className="p-3">{item.kategori}</td>
                  <td className="p-3">{formatRupiah(item.harga)}</td>
                  <td className="p-3 font-bold">{item.stok}</td>
                  <td className="p-3">
                    {item.stok < 5 && (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-bold">
                        Stok Rendah
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanStok;
