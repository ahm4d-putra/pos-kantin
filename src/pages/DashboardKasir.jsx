import { Link } from "react-router-dom";
import { ShoppingCart, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DashboardKasir = () => {
  const { user, nama } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg max-w-lg w-full border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="bg-blue-100 dark:bg-blue-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner transition-colors">
          <ShoppingCart
            className="text-blue-600 dark:text-blue-400"
            size={48}
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Halo, {nama || user?.email || "Kasir"}!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Selamat datang di Sistem POS Kantin Sekolah. Silakan klik tombol di
          bawah untuk memulai transaksi baru.
        </p>

        <Link
          to="/kasir/transaksi"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition inline-flex items-center gap-3 shadow-md hover:shadow-lg dark:shadow-blue-900/30"
        >
          <ShoppingCart size={24} />
          Mulai Transaksi Baru
        </Link>

        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKasir;
