import { useState, useEffect } from "react";
import {
  getBarang,
  addBarang,
  updateBarang,
  deleteBarang,
} from "../firebase/firestore";
import ModalBarang from "../components/ModalBarang";
import { formatRupiah } from "../utils/formatRupiah";
import { Plus, Edit, Trash2 } from "lucide-react";

const DataBarang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getBarang();
    setBarang(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };
  const handleEdit = (item) => {
    setEditingData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus barang ini?")) {
      await deleteBarang(id);
      fetchData();
    }
  };

  const handleSubmitModal = async (data) => {
    if (editingData) {
      await updateBarang(editingData.id, data);
    } else {
      await addBarang(data);
    }
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Data Barang</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">No</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Memuat data...
                </td>
              </tr>
            ) : (
              barang.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{item.nama}</td>
                  <td className="p-3">{item.kategori || "-"}</td>
                  <td className="p-3">{formatRupiah(item.harga)}</td>
                  <td className="p-3">
                    <span
                      className={`font-bold ${item.stok < 5 ? "text-red-500" : "text-green-600"}`}
                    >
                      {item.stok}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ModalBarang
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        editingData={editingData}
      />
    </div>
  );
};

export default DataBarang;
