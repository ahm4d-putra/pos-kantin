import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react"; // Tambahkan ikon Menu

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b px-4 md:px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger - Hanya muncul di mobile (lg:hidden) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Sistem POS Kantin
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">
          {user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 md:gap-2 text-red-500 hover:text-red-700 font-medium text-xs md:text-sm"
        >
          <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
