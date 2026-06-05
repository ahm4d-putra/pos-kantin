import { useState, useEffect } from "react";
import { getBarang } from "../firebase/firestore";
import { registerNewUser } from "../firebase/auth";
import { addUserToFirestore } from "../firebase/firestore";
import ModalUser from "../components/ModalUser";
import { Package, AlertTriangle, UserPlus } from "lucide-react";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({ totalBarang: 0, stokRendah: 0 });
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const barang = await getBarang();
      const stokRendah = barang.filter((b) => b.stok < 5).length;
      setStats({ totalBarang: barang.length, stokRendah });
    };
    fetchStats();
  }, []);

  const handleRegisterUser = async (data) => {
    setLoadingReg(true);
    try {
      const userCredential = await registerNewUser(data.email, data.password);
      await addUserToFirestore(userCredential.user.uid, {
        email: data.email,
        nama: data.nama,
        role: data.role,
      });
      alert("User baru berhasil didaftarkan!");
    } catch (error) {
      console.error(error);
      alert("Gagal mendaftarkan user: " + error.message);
    }
    setLoadingReg(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        <button
          onClick={() => setIsModalUserOpen(true)}
          disabled={loadingReg}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <UserPlus size={18} /> Tambah User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Package className="text-blue-600" size={28} />
          </div>
          <div>
            <p className="text-gray-500">Total Jenis Barang</p>
            <h3 className="text-2xl font-bold">{stats.totalBarang}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-600" size={28} />
          </div>
          <div>
            <p className="text-gray-500">Stok Rendah (&lt; 5)</p>
            <h3 className="text-2xl font-bold text-red-600">
              {stats.stokRendah}
            </h3>
          </div>
        </div>
      </div>

      <ModalUser
        isOpen={isModalUserOpen}
        onClose={() => setIsModalUserOpen(false)}
        onSubmit={handleRegisterUser}
      />
    </div>
  );
};

export default DashboardAdmin;
