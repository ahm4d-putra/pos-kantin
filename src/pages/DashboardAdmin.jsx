import { useState, useEffect, useMemo } from "react";
import {
  getBarang,
  getRecentTransaksi,
  getAnalyticsData,
} from "../firebase/firestore";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Trophy,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah } from "../utils/formatRupiah";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalBarang: 0,
    stokRendah: 0,
    omzetHariIni: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [topSeller, setTopSeller] = useState([]);
  const [peakHours, setPeakHours] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const barang = await getBarang();
      const stokRendah = barang.filter((b) => b.stok < 5).length;
      const transaksi = await getRecentTransaksi(7);
      const today = new Date();
      const omzetHariIni = transaksi
        .filter(
          (trx) =>
            trx.createdAt?.toDate().toDateString() === today.toDateString(),
        )
        .reduce((acc, curr) => acc + curr.total, 0);

      setStats({ totalBarang: barang.length, stokRendah, omzetHariIni });

      const groupedData = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - 6 + i);
        const dateStr = d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });
        groupedData[dateStr] = 0;
      }
      transaksi.forEach((trx) => {
        if (trx.createdAt) {
          const dateStr = trx.createdAt
            .toDate()
            .toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
          if (groupedData[dateStr] !== undefined)
            groupedData[dateStr] += trx.total;
        }
      });
      setChartData(
        Object.keys(groupedData).map((key) => ({
          name: key,
          Penjualan: groupedData[key],
        })),
      );

      const analytics = await getAnalyticsData(30);
      const itemSales = {};
      analytics.details.forEach((detail) => {
        if (!itemSales[detail.namaBarang]) itemSales[detail.namaBarang] = 0;
        itemSales[detail.namaBarang] += detail.jumlah;
      });
      setTopSeller(
        Object.entries(itemSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5),
      );

      const hourSales = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        Transaksi: 0,
      }));
      analytics.transactions.forEach((trx) => {
        if (trx.createdAt) {
          const hour = trx.createdAt.toDate().getHours();
          hourSales[hour].Transaksi += 1;
        }
      });
      setPeakHours(hourSales.filter((h) => h.Transaksi > 0));
    };

    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {label}
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard Admin
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full">
            <Package className="text-blue-600 dark:text-blue-400" size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Total Jenis Barang
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.totalBarang}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/50 flex items-center gap-4 transition-colors">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-full">
            <AlertTriangle
              className="text-red-600 dark:text-red-400"
              size={28}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Stok Rendah (&lt; 5)
            </p>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.stokRendah}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-green-100 dark:border-green-900/50 flex items-center gap-4 transition-colors">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full">
            <TrendingUp
              className="text-green-600 dark:text-green-400"
              size={28}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Omzet Hari Ini
            </p>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatRupiah(stats.omzetHariIni)}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Penjualan 7 Hari Terakhir
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#374151"
                opacity="0.1"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Penjualan"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPenjualan)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" /> Top 5 Best Seller
            (30 Hari)
          </h3>
          {topSeller.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              Belum ada data penjualan.
            </p>
          ) : (
            <div className="space-y-3">
              {topSeller.map(([name, qty], index) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-yellow-100 text-yellow-700" : index === 1 ? "bg-gray-100 text-gray-700" : "bg-orange-50 text-orange-700"}`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white truncate">
                      {name}
                    </span>
                  </div>
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg font-semibold text-sm">
                    {qty} Terjual
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-purple-500" /> Jam Ramai (Peak
            Hours)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#374151"
                  opacity="0.1"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="Transaksi" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
