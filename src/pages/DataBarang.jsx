import { useState, useEffect } from "react";
import { getBarang, addBarang, updateBarang, deleteBarang } from "../firebase/firestore";
import ModalBarang from "../components/ModalBarang";
import { formatRupiah } from "../utils/formatRupiah";
import { Plus, Edit, Trash2, Search, Package, Loader2, ImageOff } from "lucide-react";

const DataBarang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const data = await getBarang();
    setBarang(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditingData(null); setIsModalOpen(true); };
  const handleEdit = (item) => { setEditingData(item); setIsModalOpen(true); };
  
  const handleDelete = async (id) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus barang ini?")) {
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

  const filteredBarang = barang.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.kategori && item.kategori.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Data Barang</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola semua produk kantin disini</p>
        </div>
        <button onClick={handleAdd} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm font-semibold">
          <Plus size={20} /> Tambah Barang
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="Cari nama barang atau kategori..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-colors">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
            <Package className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Produk</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{barang.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider w-12">No</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">Produk</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider text-right">Harga</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider text-center">Stok</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-10">
                    <Loader2 className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
                    <span className="text-gray-400 dark:text-gray-500 block">Memuat data barang...</span>
                  </td>
                </tr>
              ) : filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 py-4">
                      <Search size={32} className="mb-2 opacity-30" />
                      {searchTerm ? `Tidak ada barang untuk "${searchTerm}"` : "Belum ada data barang."}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBarang.map((item, index) => {
                  const isLow = item.stok > 0 && item.stok < 5;
                  const isEmpty = item.stok === 0;

                  return (
                    <tr key={item.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isEmpty ? 'bg-gray-50 dark:bg-gray-800 opacity-80' : ''}`}>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{index + 1}</td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-500">
                            {item.gambarUrl ? (
                              <img src={item.gambarUrl} alt={item.nama} className="w-full h-full object-cover" />
                            ) : (
                              <ImageOff size={16} className="text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold text-gray-800 dark:text-white ${isEmpty ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>{item.nama}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.kategori || "Tanpa Kategori"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-right font-semibold text-gray-800 dark:text-white font-mono text-sm">
                        {formatRupiah(item.harga)}
                      </td>

                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          isEmpty ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400' : 
                          isLow ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          {item.stok} {isEmpty ? '(Habis)' : isLow ? '(Rendah)' : ''}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalBarang isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitModal} editingData={editingData} />
    </div>
  );
};

export default DataBarang;