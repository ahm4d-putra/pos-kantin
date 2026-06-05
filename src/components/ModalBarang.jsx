import { useState, useEffect } from "react";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-bold mb-4">
          {editingData ? "Edit Barang" : "Tambah Barang"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama Barang"
            className="w-full border p-2 rounded"
          />
          <input
            name="harga"
            type="number"
            value={formData.harga}
            onChange={handleChange}
            placeholder="Harga (Angka)"
            className="w-full border p-2 rounded"
          />
          <input
            name="stok"
            type="number"
            value={formData.stok}
            onChange={handleChange}
            placeholder="Stok"
            className="w-full border p-2 rounded"
          />
          <input
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            placeholder="Kategori (Opsional)"
            className="w-full border p-2 rounded"
          />
          <input
            name="gambarUrl"
            value={formData.gambarUrl}
            onChange={handleChange}
            placeholder="URL Gambar (Opsional)"
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBarang;
