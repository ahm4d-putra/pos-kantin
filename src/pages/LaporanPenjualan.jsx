import { useState } from "react";
import { getTransaksiByDate, getDetailTransaksi } from "../firebase/firestore";
import { formatRupiah } from "../utils/formatRupiah";
import { formatTanggal } from "../utils/formatTanggal";
import { Search, ChevronDown, ChevronUp, Package, Loader2 } from "lucide-react";

const LaporanPenjualan = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalOmzet, setTotalOmzet] = useState(0);

  // State untuk fitur expand detail
  const [expandedTrxId, setExpandedTrxId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleFilter = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Pilih tanggal mulai dan akhir!");
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const data = await getTransaksiByDate(start, end);
    const omzet = data.reduce((acc, curr) => acc + curr.total, 0);
    setTransaksi(data);
    setTotalOmzet(omzet);
    setExpandedTrxId(null); // Reset expand saat filter baru
  };

  // Fungsi saat tombol expand diklik
  const handleExpand = async (trxId) => {
    if (expandedTrxId === trxId) {
      setExpandedTrxId(null); // Tutup jika diklik lagi
      return;
    }

    setExpandedTrxId(trxId);
    setLoadingDetail(true);
    try {
      const items = await getDetailTransaksi(trxId);
      setDetailItems(items);
    } catch (error) {
      console.error("Gagal mengambil detail:", error);
    }
    setLoadingDetail(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Laporan Penjualan
      </h2>

      <form
        onSubmit={handleFilter}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-sm transition-colors"
        >
          <Search size={18} /> Filter
        </button>
      </form>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 mb-6 rounded-xl shadow-sm">
        <p className="text-sm font-medium text-green-700">
          Total Omzet Periode Ini
        </p>
        <h3 className="text-3xl font-extrabold text-green-800 mt-1">
          {formatRupiah(totalOmzet)}
        </h3>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm w-10"></th>
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  ID Transaksi
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  Waktu
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  Kasir
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-400">
                    Belum ada data transaksi. Gunakan filter di atas.
                  </td>
                </tr>
              ) : (
                transaksi.map((trx) => (
                  <>
                    {/* Baris Utama Transaksi */}
                    <tr
                      key={trx.id}
                      className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${expandedTrxId === trx.id ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleExpand(trx.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {expandedTrxId === trx.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </td>
                      <td className="p-4 font-mono text-sm font-semibold text-gray-800">
                        #{trx.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatTanggal(trx.createdAt)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {trx.kasirNama}
                      </td>
                      <td className="p-4 text-right font-bold text-gray-800">
                        {formatRupiah(trx.total)}
                      </td>
                    </tr>

                    {/* Baris Detail Barang (Muncul saat di-expand) */}
                    {expandedTrxId === trx.id && (
                      <tr
                        key={`${trx.id}-detail`}
                        className="bg-gray-50/50 border-b border-gray-200"
                      >
                        <td colSpan="5" className="p-0">
                          <div className="p-6 border-l-4 border-blue-500 ml-4 my-4 bg-white rounded-lg shadow-sm">
                            <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                              <Package size={16} className="text-blue-500" />{" "}
                              Detail Barang yang Dibeli
                            </h4>

                            {loadingDetail ? (
                              <div className="flex justify-center items-center py-4 text-gray-400">
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={18}
                                />{" "}
                                Memuat detail...
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {/* Header List Detail */}
                                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b">
                                  <div className="col-span-5">Nama Barang</div>
                                  <div className="col-span-2 text-center">
                                    Harga
                                  </div>
                                  <div className="col-span-2 text-center">
                                    Jumlah
                                  </div>
                                  <div className="col-span-3 text-right">
                                    Subtotal
                                  </div>
                                </div>

                                {detailItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-12 gap-4 items-center text-sm"
                                  >
                                    <div className="col-span-5 font-medium text-gray-800">
                                      {item.namaBarang}
                                    </div>
                                    <div className="col-span-2 text-center text-gray-600 font-mono">
                                      {formatRupiah(item.harga)}
                                    </div>
                                    <div className="col-span-2 text-center">
                                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-xs font-bold">
                                        {item.jumlah}x
                                      </span>
                                    </div>
                                    <div className="col-span-3 text-right font-semibold text-gray-800 font-mono">
                                      {formatRupiah(item.subtotal)}
                                    </div>
                                  </div>
                                ))}

                                {/* Ringkasan Pembayaran di Detail */}
                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 space-y-2 text-sm">
                                  <div className="flex justify-between text-gray-600">
                                    <span>Total Belanja</span>
                                    <span className="font-bold font-mono">
                                      {formatRupiah(trx.total)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-600">
                                    <span>Dibayar (Tunai)</span>
                                    <span className="font-bold font-mono">
                                      {formatRupiah(trx.bayar)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-green-600">
                                    <span>Kembalian</span>
                                    <span className="font-bold font-mono">
                                      {formatRupiah(trx.kembalian)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanPenjualan;
