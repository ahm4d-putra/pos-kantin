import { useState } from "react";
import { getTransaksiByDate } from "../firebase/firestore";
import { formatRupiah } from "../utils/formatRupiah";
import { formatTanggal } from "../utils/formatTanggal";

const LaporanPenjualan = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalOmzet, setTotalOmzet] = useState(0);

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
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Laporan Penjualan</h2>
      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </form>
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 font-bold text-lg">
        Total Omzet: {formatRupiah(totalOmzet)}
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">ID Transaksi</th>
              <th className="p-3">Kasir</th>
              <th className="p-3">Waktu</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada data. Gunakan filter di atas.
                </td>
              </tr>
            ) : (
              transaksi.map((trx) => (
                <tr key={trx.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">
                    {trx.id.substring(0, 8)}...
                  </td>
                  <td className="p-3">{trx.kasirNama}</td>
                  <td className="p-3">{formatTanggal(trx.createdAt)}</td>
                  <td className="p-3 font-bold">{formatRupiah(trx.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanPenjualan;
