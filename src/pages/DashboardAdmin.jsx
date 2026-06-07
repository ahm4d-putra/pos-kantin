import { useState, useEffect, useMemo } from "react";
import { getBarang, getRecentTransaksi } from "../firebase/firestore";
import { registerNewUser } from "../firebase/auth";
import { addUserToFirestore } from "../firebase/firestore";
import ModalUser from "../components/ModalUser";
import { Package, AlertTriangle, UserPlus, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatRupiah } from "../utils/formatRupiah";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({ totalBarang: 0, stokRendah: 0, omzetHariIni: 0 });
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch Barang
      const barang = await getBarang();
      const stokRendah = barang.filter(b => b.stok < 5).length;
      
      // Fetch Transaksi 7 hari terakhir
      const transaksi = await getRecentTransaksi(7);
      
      // Hitung omzet hari ini
      const today = new Date();
      const omzetHariIni = transaksi
        .filter(trx => {
          const trxDate = trx.createdAt.toDate();
          return trxDate.toDateString() === today.toDateString();
        })
        .reduce((acc, curr) => acc + curr.total, 0);

      setStats({ totalBarang: barang.length, stokRendah, omzetHariIni });

      // Proses data untuk Chart (Group by Hari)
      const groupedData = {};
      const startDate = new Date();
      startDate.setDate(today.getDate() - 6); // 6 hari lalu + hari ini = 7 hari
      startDate.setHours(0, 0, 0, 0);

      // Inisialisasi 7 hari terakhir dengan nilai 0 agar chart tidak kosong
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        groupedData[dateStr] = 0;
      }

      // Jumlahkan total penjualan per hari
      transaksi.forEach(trx => {
        if (trx.createdAt) {
          const date = trx.createdAt.toDate();
          const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
          if (groupedData[dateStr] !== undefined) {
            groupedData[dateStr] += trx.total;
          }
        }
      });

      // Ubah object jadi array untuk Recharts
      const formattedChartData = Object.keys(groupedData).map(key => ({
        name: key,
        Penjualan: groupedData[key]
      }));

      setChartData(formattedChartData);
    };

    fetchStats();
  }, []);

  const handleRegisterUser = async (data) => {
    setLoadingReg(true);
    try {
      const userCredential = await registerNewUser(data.email, data.password);
      await addUserToFirestore(userCredential.user.uid, { email: data.email, nama: data.nama, role: data.role });
      alert("User baru berhasil didaftarkan!");
    } catch (error) {
      console.error(error);
      alert("Gagal mendaftarkan user: " + error.message);
    }
    setLoadingReg(false);
  };

  // Custom Tooltip untuk Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-600">{label}</p>
          <p className="text-lg font-bold text-blue-600">{formatRupiah(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        <button onClick={() => setIsModalUserOpen(true)} disabled={loadingReg} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700">
          <UserPlus size={18} /> Tambah User
        </button>
      </div>

      {/* Card Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-full"><Package className="text-blue-600" size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Jenis Barang</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalBarang}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-full"><AlertTriangle className="text-red-600" size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Stok Rendah (&lt; 5)</p>
            <h3 className="text-2xl font-bold text-red-600">{stats.stokRendah}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-full"><TrendingUp className="text-green-600" size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Omzet Hari Ini</p>
            <h3 className="text-2xl font-bold text-green-600">{formatRupiah(stats.omzetHariIni)}</h3>
          </div>
        </div>
      </div>

      {/* Chart Penjualan 7 Hari Terakhir */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Penjualan 7 Hari Terakhir</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `${value/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Penjualan" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPenjualan)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ModalUser isOpen={isModalUserOpen} onClose={() => setIsModalUserOpen(false)} onSubmit={handleRegisterUser} />
    </div>
  );
};

export default DashboardAdmin;