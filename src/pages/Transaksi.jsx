import useBarang from "../hooks/useBarang";
import useTransaksi from "../hooks/useTransaksi";
import KeranjangItem from "../components/KeranjangItem";
import StrukPrint from "../components/StrukPrint";
import { formatRupiah } from "../utils/formatRupiah";
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react";

const Transaksi = () => {
  const { barang, loading: loadingBarang } = useBarang();
  const {
    keranjang,
    bayar,
    setBayar,
    total,
    kembalian,
    loading: loadingTrx,
    showStruk,
    dataStruk,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    handleCheckout,
    setShowStruk,
  } = useTransaksi();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Kiri: Daftar Produk */}
      <div className="flex-1 overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Pilih Barang</h2>
        {loadingBarang ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : barang.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            Belum ada barang terdaftar.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {barang.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className={`bg-white p-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 ${item.stok === 0 ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="bg-gray-100 h-28 rounded-lg mb-2 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                  {item.gambarUrl ? (
                    <img
                      src={item.gambarUrl}
                      alt={item.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>No Img</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-gray-800 truncate px-1">
                  {item.nama}
                </h3>
                <div className="flex justify-between items-center mt-1 px-1 pb-1">
                  <p className="text-blue-600 font-bold text-sm">
                    {formatRupiah(item.harga)}
                  </p>
                  <p className="text-xs text-gray-400">Stok: {item.stok}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kanan: Keranjang & Pembayaran */}
      <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3 rounded-t-2xl">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ShoppingCart size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Keranjang</h3>
            <p className="text-xs text-gray-500">
              {keranjang.length} item dipilih
            </p>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          {keranjang.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
              <ShoppingCart size={48} className="mb-3 opacity-30" />
              <p className="text-sm">Keranjang masih kosong</p>
              <p className="text-xs mt-1">Klik produk untuk menambahkan</p>
            </div>
          ) : (
            <div className="space-y-1">
              {keranjang.map((item) => {
                const barangDb = barang.find((b) => b.id === item.id);
                const stokSekarang = barangDb ? barangDb.stok : item.stokAwal;
                return (
                  <KeranjangItem
                    key={item.id}
                    item={item}
                    onIncrease={() => increaseQty(item.id, stokSekarang)}
                    onDecrease={() => decreaseQty(item.id)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Belanja</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatRupiah(total)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nominal Bayar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CreditCard size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                value={bayar}
                onChange={(e) => setBayar(e.target.value)}
                placeholder="Masukkan nominal uang bayar..."
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm text-lg font-semibold"
              />
            </div>
          </div>

          {bayar && (
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100">
              <span className="text-sm text-gray-600">Kembalian</span>
              <span
                className={`font-bold text-lg ${kembalian < 0 ? "text-red-500" : "text-green-600"}`}
              >
                {formatRupiah(kembalian)}
              </span>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loadingTrx || keranjang.length === 0}
            className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingTrx ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Memproses...
              </>
            ) : (
              "Bayar & Cetak Struk"
            )}
          </button>
        </div>
      </div>

      {/* Modal Struk */}
      {showStruk && (
        <StrukPrint data={dataStruk} onClose={() => setShowStruk(false)} />
      )}
    </div>
  );
};

export default Transaksi;
