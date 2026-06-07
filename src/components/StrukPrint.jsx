import { formatRupiah } from "../utils/formatRupiah";
import { formatTanggal } from "../utils/formatTanggal";
import { X, Printer, Receipt } from "lucide-react";

const StrukPrint = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:bg-white print:p-0 print:backdrop-blur-none print:items-start">
      {/* Container Struk */}
      <div className="bg-white w-full max-w-sm shadow-2xl rounded-2xl relative overflow-hidden print:max-w-[80mm] print:rounded-none print:shadow-none">
        {/* Tombol Close (Hilang saat print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-1.5 rounded-full transition-colors print:hidden"
        >
          <X size={18} />
        </button>

        <div className="p-8 pt-10 print:p-4 print:pt-4">
          {/* Header Struk */}
          <div className="text-center border-b-2 border-dashed border-gray-200 pb-5 mb-5">
            <div className="flex justify-center mb-3 print:hidden">
              <div className="bg-blue-50 p-3 rounded-full">
                <Receipt className="text-blue-600" size={28} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold tracking-wider text-gray-900 uppercase">
              Kantin Bisnis Digital
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Jl. Melati No.24 13, RT.13/RW.10, Cilandak Bar., Kec. Cilandak,
              Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430
            </p>
            <p className="text-xs text-gray-400 mt-1">Telp: (021)-7504162</p>
          </div>

          {/* Info Transaksi */}
          <div className="space-y-1.5 mb-5 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">No. Transaksi</span>
              <span className="font-mono font-bold text-gray-800">
                #{data.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Tanggal</span>
              <span>{formatTanggal(data.tanggal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Kasir</span>
              <span>{data.kasir}</span>
            </div>
          </div>

          {/* Daftar Barang */}
          <div className="border-t-2 border-b-2 border-dashed border-gray-200 py-4 space-y-3">
            {data.items.map((item, i) => (
              <div key={i}>
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {item.nama}
                </p>
                <div className="flex justify-between text-sm text-gray-500 mt-0.5">
                  <span className="font-mono">
                    {item.jumlah} x {formatRupiah(item.harga)}
                  </span>
                  <span className="font-semibold text-gray-700 font-mono">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Pembayaran */}
          <div className="py-5 space-y-2">
            <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl -mx-2 print:rounded-none print:bg-white print:text-black print:border-2 print:border-black">
              <span className="text-lg font-bold tracking-wide">TOTAL</span>
              <span className="text-2xl font-extrabold font-mono">
                {formatRupiah(data.total)}
              </span>
            </div>

            <div className="flex justify-between text-sm pt-2 px-2">
              <span className="text-gray-500 font-medium">Tunai Bayar</span>
              <span className="font-semibold text-gray-700 font-mono">
                {formatRupiah(data.bayar)}
              </span>
            </div>

            <div className="flex justify-between items-center px-2 pb-2">
              <span className="text-gray-500 font-medium">Kembalian</span>
              <span className="font-bold text-lg text-green-600 font-mono">
                {formatRupiah(data.kembalian)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-dashed border-gray-200 pt-5 text-center">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
              --- Terima Kasih ---
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Barang yang sudah dibeli tidak dapat ditukar
            </p>
          </div>
        </div>

        {/* Tombol Cetak (Hilang saat print) */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 print:hidden">
          <button
            onClick={() => window.print()}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <Printer size={20} /> Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrukPrint;
