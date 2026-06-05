import useBarang from "../hooks/useBarang";
import useTransaksi from "../hooks/useTransaksi";
import KeranjangItem from "../components/KeranjangItem";
import StrukPrint from "../components/StrukPrint";
import { formatRupiah } from "../utils/formatRupiah";
import { ShoppingCart } from "lucide-react";

const Transaksi = () => {
  const { barang, loading: loadingBarang } = useBarang();
  const { keranjang, bayar, setBayar, total, kembalian, loading: loadingTrx, showStruk, dataStruk, addToCart, increaseQty, decreaseQty, removeFromCart, handleCheckout, setShowStruk } = useTransaksi();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Pilih Barang</h2>
        {loadingBarang ? <p>Memuat produk...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {barang.map((item) => (
              <div key={item.id} onClick={() => addToCart(item)} className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition ${item.stok === 0 ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="bg-gray-200 h-20 rounded mb-2 flex items-center justify-center text-gray-500 text-xs">{item.gambarUrl ? <img src={item.gambarUrl} alt={item.nama} className="h-full object-cover rounded" /> : "No Img"}</div>
                <h3 className="font-medium text-sm truncate">{item.nama}</h3>
                <p className="text-blue-600 font-bold mt-1">{formatRupiah(item.harga)}</p>
                <p className="text-xs text-gray-500">Stok: {item.stok}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-96 bg-white rounded-lg shadow flex flex-col">
        <div className="p-4 border-b bg-blue-50 flex items-center gap-2"><ShoppingCart size={20} className="text-blue-600" /><h3 className="font-bold text-lg">Keranjang</h3></div>
        <div className="flex-1 p-4 overflow-y-auto">
          {keranjang.length === 0 ? <p className="text-center text-gray-400 mt-10">Keranjang kosong</p> :
            keranjang.map((item) => {
              const barangDb = barang.find(b => b.id === item.id);
              const stokSekarang = barangDb ? barangDb.stok : item.stokAwal;
              return <KeranjangItem key={item.id} item={item} onIncrease={() => increaseQty(item.id, stokSekarang)} onDecrease={() => decreaseQty(item.id)} onRemove={() => removeFromCart(item.id)} />;
            })
          }
        </div>
        <div className="p-4 border-t bg-gray-50 space-y-3">
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-blue-600">{formatRupiah(total)}</span></div>
          <input type="number" value={bayar} onChange={(e) => setBayar(e.target.value)} placeholder="Uang dibayar..." className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="flex justify-between text-sm"><span>Kembalian</span><span className={`font-bold ${kembalian < 0 ? "text-red-500" : "text-green-600"}`}>{formatRupiah(kembalian)}</span></div>
          <button onClick={handleCheckout} disabled={loadingTrx} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-green-400">{loadingTrx ? "Memproses..." : "Bayar & Cetak Struk"}</button>
        </div>
      </div>
      {showStruk && <StrukPrint data={dataStruk} onClose={() => setShowStruk(false)} />}
    </div>
  );
};

export default Transaksi;