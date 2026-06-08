import { useState, useEffect } from "react";
import { getAllUsers } from "../firebase/firestore";
import { registerNewUser } from "../firebase/auth";
import { addUserToFirestore } from "../firebase/firestore";
import ModalUser from "../components/ModalUser";
import { Users, Plus, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data.sort((a, b) => (a.role === 'admin' ? -1 : 1)));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (data) => {
    try {
      const userCredential = await registerNewUser(data.email, data.password);
      await addUserToFirestore(userCredential.user.uid, { 
        email: data.email, nama: data.nama, role: data.role, photoURL: ""
      });
      alert("User baru berhasil didaftarkan!");
      fetchUsers();
    } catch (error) {
      alert("Gagal mendaftarkan user: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen User</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola akun kasir dan admin kantin</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full md:w-auto bg-green-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-sm font-semibold"
        >
          <Plus size={20} /> Tambah User Baru
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">Nama</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">Email</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider text-center">Role Akses</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center p-10">
                    <Loader2 className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
                    <span className="text-gray-400 block">Memuat data user...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-10 text-gray-400">Belum ada data user terdaftar.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                          {user.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                        </div>
                        {user.nama || "Tanpa Nama"}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{user.email}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalUser isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddUser} />
    </div>
  );
};

export default ManajemenUser;