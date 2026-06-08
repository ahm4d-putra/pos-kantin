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
    setExpandedTrxId(null);
  };

  const handleExpand = async (trxId) => {
    if (expandedTrxId === trxId) {
      setExpandedTrxId(null);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Laporan Penjualan
      </h2>

      <form
        onSubmit={handleFilter}
        className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-end transition-colors"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-sm transition-colors"
        >
          <Search size={18} /> Filter
        </button>
      </form>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 p-5 mb-6 rounded-xl shadow-sm transition-colors">
        <p className="text-sm font-medium text-green-700 dark:text-green-400">
          Total Omzet Periode Ini
        </p>
        <h3 className="text-3xl font-extrabold text-green-800 dark:text-green-300 mt-1">
          {formatRupiah(totalOmzet)}
        </h3>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider w-10"></th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  ID Transaksi
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  Waktu
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  Kasir
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-400 dark:text-gray-500"
                  >
                    Belum ada data transaksi. Gunakan filter di atas.
                  </td>
                </tr>
              ) : (
                transaksi.map((trx) => (
                  <>
                    <tr
                      key={trx.id}
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${expandedTrxId === trx.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleExpand(trx.id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {expandedTrxId === trx.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </td>
                      <td className="p-4 font-mono text-sm font-semibold text-gray-800 dark:text-white">
                        #{trx.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatTanggal(trx.createdAt)}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {trx.kasirNama}
                      </td>
                      <td className="p-4 text-right font-bold text-gray-800 dark:text-white">
                        {formatRupiah(trx.total)}
                      </td>
                    </tr>

                    {expandedTrxId === trx.id && (
                      <tr
                        key={`${trx.id}-detail`}
                        className="bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700"
                      >
                        <td colSpan="5" className="p-0">
                          <div className="p-6 border-l-4 border-blue-500 ml-4 my-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
                            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                              <Package size={16} className="text-blue-500" />{" "}
                              Detail Barang yang Dibeli
                            </h4>

                            {loadingDetail ? (
                              <div className="flex justify-center items-center py-4 text-gray-400 dark:text-gray-500">
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={18}
                                />{" "}
                                Memuat detail...
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700">
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
                                    <div className="col-span-5 font-medium text-gray-800 dark:text-white">
                                      {item.namaBarang}
                                    </div>
                                    <div className="col-span-2 text-center text-gray-600 dark:text-gray-300 font-mono">
                                      {formatRupiah(item.harga)}
                                    </div>
                                    <div className="col-span-2 text-center">
                                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md text-xs font-bold">
                                        {item.jumlah}x
                                      </span>
                                    </div>
                                    <div className="col-span-3 text-right font-semibold text-gray-800 dark:text-white font-mono">
                                      {formatRupiah(item.subtotal)}
                                    </div>
                                  </div>
                                ))}

                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Total Belanja</span>
                                    <span className="font-bold font-mono">
                                      {formatRupiah(trx.total)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Dibayar (Tunai)</span>
                                    <span className="font-bold font-mono">
                                      {formatRupiah(trx.bayar)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-green-600 dark:text-green-400">
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
