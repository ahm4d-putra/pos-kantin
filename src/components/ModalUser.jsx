import { useState } from "react";

const ModalUser = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nama: "",
    role: "kasir",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.nama)
      return alert("Lengkapi semua data!");
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-bold mb-4">Tambah User (Kasir/Admin)</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (Min 6 karakter)"
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="kasir">Kasir</option>
            <option value="admin">Admin</option>
          </select>
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
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Daftarkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUser;
