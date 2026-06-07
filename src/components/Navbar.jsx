import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react"; // Hapus Bell, cukup LogOut aja

const Navbar = () => {
  const { user, role, nama, photoURL } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const getInitial = () => {
    if (nama) return nama.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <>
      {/* === DESKTOP NAVBAR === */}
      <nav className="hidden lg:flex bg-white shadow-sm border-b px-6 py-3 justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Sistem POS Kantin
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-800">
                {nama || user?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-white">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {getInitial()}
                </span>
              )}
            </div>
          </Link>
          <div className="w-px h-8 bg-gray-200"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl font-medium text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* === MOBILE APP HEADER === */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/profile" className="block">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-white">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {getInitial()}
                  </span>
                )}
              </div>
            </Link>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                {nama || "Pengguna"}
              </h2>
              <p className="text-[10px] text-gray-500 font-medium capitalize">
                {role === "admin" ? "Administrator" : "Cashier"}
              </p>
            </div>
          </div>

          {/* TOMBOL LOGOUT DI MOBILE */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-500 hover:text-red-600 active:scale-95"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
