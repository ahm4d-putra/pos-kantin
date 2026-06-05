import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Sistem POS Kantin</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
