import { formatRupiah } from "../utils/formatRupiah";
import { formatTanggal } from "../utils/formatTanggal";
import { X } from "lucide-react";

const StrukPrint = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 print:bg-white print:inset-0">
      <div className="bg-white w-80 p-6 rounded-lg shadow-lg relative print:shadow-none print:w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 print:hidden"
        >
          <X size={20} />
        </button>
        <div className="text-center border-b border-dashed pb-3 mb-3">
          <h3 className="font-bold text-lg">KANTIN SEKOLAH</h3>
          <p className="text-xs text-gray-500">Jl. Pendidikan No. 1</p>
        </div>
        <div className="text-xs mb-4">
          <p>No: {data.id.substring(0, 8)}</p>
          <p>Tanggal: {formatTanggal(data.tanggal)}</p>
          <p>Kasir: {data.kasir}</p>
        </div>
        <div className="border-t border-b border-dashed py-2 space-y-2 text-sm">
          {data.items.map((item, i) => (
            <div key={i}>
              <p className="font-medium">{item.nama}</p>
              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  {item.jumlah} x {formatRupiah(item.harga)}
                </span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between font-bold text-base border-t border-dashed pt-2">
            <span>TOTAL</span>
            <span>{formatRupiah(data.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Bayar</span>
            <span>{formatRupiah(data.bayar)}</span>
          </div>
          <div className="flex justify-between font-bold text-green-600">
            <span>Kembalian</span>
            <span>{formatRupiah(data.kembalian)}</span>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>--- Terima Kasih ---</p>
        </div>
        <button
          onClick={() => window.print()}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded print:hidden"
        >
          Cetak Struk
        </button>
      </div>
    </div>
  );
};

export default StrukPrint;
