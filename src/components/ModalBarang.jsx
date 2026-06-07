import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalBarang = ({ isOpen, onClose, onSubmit, editingData }) => {
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    stok: "",
    kategori: "",
    gambarUrl: "",
  });

  useEffect(() => {
    if (editingData) setFormData(editingData);
    else
      setFormData({
        nama: "",
        harga: "",
        stok: "",
        kategori: "",
        gambarUrl: "",
      });
  }, [editingData, isOpen]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.harga || !formData.stok)
      return alert("Nama, Harga, dan Stok wajib diisi!");
    onSubmit({
      ...formData,
      harga: Number(formData.harga),
      stok: Number(formData.stok),
    });
    onClose();
  };

  if (!isOpen) return null;

  // Global Class untuk Input di Modal
  const inputStyle =
    "block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">
            {editingData ? "Edit Barang" : "Tambah Barang Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Barang
            </label>
            <input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Nasi Goreng Spesial"
              className={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga (Rp)
              </label>
              <input
                name="harga"
                type="number"
                value={formData.harga}
                onChange={handleChange}
                placeholder="10000"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stok
              </label>
              <input
                name="stok"
                type="number"
                value={formData.stok}
                onChange={handleChange}
                placeholder="20"
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori
            </label>
            <input
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              placeholder="Makanan / Minuman"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link Gambar Produk
            </label>
            <input
              name="gambarUrl"
              type="url"
              value={formData.gambarUrl}
              onChange={handleChange}
              placeholder="https://contoh-gambar.com/gambar.jpg"
              className={inputStyle}
            />
            {formData.gambarUrl && (
              <div className="mt-3 p-2 bg-gray-50 rounded-xl inline-block border border-gray-100">
                <img
                  src={formData.gambarUrl}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg shadow-sm"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBarang;
