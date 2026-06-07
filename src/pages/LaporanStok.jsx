import { useState, useEffect } from "react";
import { getBarang } from "../firebase/firestore";
import { formatRupiah } from "../utils/formatRupiah";
import {
  AlertTriangle,
  Package,
  CheckCircle2,
  XCircle,
  Loader2,
  Archive,
} from "lucide-react";

const LaporanStok = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBarang();
      // Urutkan dari stok paling kecil ke paling besar (yang habis/rendah di atas)
      setBarang(data.sort((a, b) => a.stok - b.stok));
      setLoading(false);
    };
    fetchData();
  }, []);

  // Hitung statistik untuk kartu atas
  const totalItems = barang.length;
  const stokKritis = barang.filter((b) => b.stok > 0 && b.stok < 5).length;
  const stokHabis = barang.filter((b) => b.stok === 0).length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Laporan Stok Barang
      </h2>

      {/* Kartu Statistik Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Package className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Jenis Barang
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{totalItems}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-200 flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Stok Kritis (&lt; 5)
            </p>
            <h3 className="text-2xl font-bold text-red-600">{stokKritis}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-xl">
            <XCircle className="text-gray-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Barang Habis</p>
            <h3 className="text-2xl font-bold text-gray-700">{stokHabis}</h3>
          </div>
        </div>
      </div>

      {/* Tabel Stok Detail */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Kategori
                </th>
                <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">
                  Harga
                </th>
                <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">
                  Sisa Stok
                </th>
                <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-10">
                    <Loader2
                      className="animate-spin text-blue-500 mx-auto mb-2"
                      size={24}
                    />
                    <span className="text-gray-400">Memuat data stok...</span>
                  </td>
                </tr>
              ) : barang.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-400 flex flex-col items-center"
                  >
                    <Archive size={32} className="mb-2 opacity-50" />
                    Belum ada data barang.
                  </td>
                </tr>
              ) : (
                barang.map((item) => {
                  const isLow = item.stok > 0 && item.stok < 5;
                  const isEmpty = item.stok === 0;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 transition-colors ${isEmpty ? "bg-gray-50 opacity-70" : isLow ? "bg-red-50/70 hover:bg-red-50" : "hover:bg-gray-50"}`}
                    >
                      <td
                        className={`p-4 font-semibold ${isEmpty ? "text-gray-400 line-through" : "text-gray-800"}`}
                      >
                        {item.nama}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {item.kategori || "-"}
                      </td>
                      <td className="p-4 text-sm text-gray-700 text-right font-mono">
                        {formatRupiah(item.harga)}
                      </td>

                      <td className="p-4 text-center">
                        <div
                          className={`flex items-center justify-center gap-2 font-bold text-lg ${isEmpty ? "text-gray-400" : isLow ? "text-red-600" : "text-gray-800"}`}
                        >
                          {isLow && (
                            <AlertTriangle
                              size={18}
                              className="text-red-500 animate-pulse"
                            />
                          )}
                          {item.stok}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        {isEmpty ? (
                          <span className="px-3 py-1.5 inline-flex items-center gap-1.5 rounded-full text-xs font-bold bg-gray-200 text-gray-700 uppercase tracking-wider">
                            <XCircle size={14} /> Habis
                          </span>
                        ) : isLow ? (
                          <span className="px-3 py-1.5 inline-flex items-center gap-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">
                            <AlertTriangle size={14} /> Kritis
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 inline-flex items-center gap-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider">
                            <CheckCircle2 size={14} /> Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanStok;
