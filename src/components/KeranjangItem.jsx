import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "../utils/formatRupiah";

const KeranjangItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex items-center justify-between border-b py-2 gap-2">
      <div className="flex-1">
        <p className="font-medium text-sm">{item.nama}</p>
        <p className="text-xs text-gray-500">
          {formatRupiah(item.harga)} x {item.jumlah}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrease(item.id)}
          className="bg-gray-200 p-1 rounded hover:bg-gray-300"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm">{item.jumlah}</span>
        <button
          onClick={() => onIncrease(item.id)}
          className="bg-gray-200 p-1 rounded hover:bg-gray-300"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="w-24 text-right font-bold text-sm">
        {formatRupiah(item.subtotal)}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default KeranjangItem;
