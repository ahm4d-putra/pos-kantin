import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart2,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

const Sidebar = () => {
  const { role } = useAuth();

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/barang", icon: Package, label: "Data Barang" },
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
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <span className="text-2xl font-bold text-blue-400">KantinPOS</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded transition-colors duration-200 ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`
            }
          >
            <link.icon size={20} />{" "}
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        © 2024 KantinPOS
      </div>
    </div>
  );
};

export default Sidebar;
