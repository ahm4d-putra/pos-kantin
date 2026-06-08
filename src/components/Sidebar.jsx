import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart2,
  DollarSign,
  Users,
  ShoppingCart,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { role } = useAuth();

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/barang", icon: Package, label: "Data Barang" },
    { to: "/admin/manajemen-user", icon: Users, label: "Manajemen User" },
    { to: "/admin/laporan-stok", icon: BarChart2, label: "Laporan Stok" },
    {
      to: "/admin/laporan-penjualan",
      icon: DollarSign,
      label: "Laporan Penjualan",
    },
  ];

  const kasirLinks = [
    { to: "/kasir/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/kasir/transaksi", icon: ShoppingCart, label: "Transaksi Baru" },
  ];

  const links = role === "admin" ? adminLinks : kasirLinks;

  return (
    <>
      {/* Overlay gelap di belakang sidebar saat mobile dibuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between border-b border-gray-800 px-4">
          <span className="text-2xl font-bold text-blue-400">KantinPOS</span>
          {/* Tombol Close Sidebar di Mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar} // Tutup sidebar otomatis saat menu diklik di HP
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          © 2024 KantinPOS
        </div>
      </div>
    </>
  );
};

export default Sidebar;
