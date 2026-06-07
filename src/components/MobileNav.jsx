import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart2,
  ShoppingCart,
  ClipboardList,
  UserCircle,
} from "lucide-react";

const MobileNav = () => {
  const { role } = useAuth();

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/admin/barang", icon: Package, label: "Barang" },
    { to: "/admin/laporan-stok", icon: BarChart2, label: "Stok" },
    { to: "/admin/laporan-penjualan", icon: ClipboardList, label: "Laporan" },
    { to: "/profile", icon: UserCircle, label: "Profil" },
  ];

  const kasirLinks = [
    { to: "/kasir/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/kasir/transaksi", icon: ShoppingCart, label: "Kasir" },
    { to: "/profile", icon: UserCircle, label: "Profil" },
  ];

  const links = role === "admin" ? adminLinks : kasirLinks;

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-gray-200/50 flex justify-around items-center h-16 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-300 rounded-xl ${
                isActive
                  ? "text-blue-600 bg-blue-50 scale-105"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] font-semibold`}>
                  {link.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
