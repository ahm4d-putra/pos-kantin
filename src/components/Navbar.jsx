import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react"; // Tambahkan Sun & Moon
import { useDarkMode } from "../hooks/useDarkMode"; // Import hook

const Navbar = () => {
  const { user, role, nama, photoURL } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useDarkMode(); // Panggil hook

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
      {/* DESKTOP NAVBAR */}
      <nav className="hidden lg:flex bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 px-6 py-3 justify-between items-center transition-colors duration-300">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Sistem POS Kantin
        </h1>
        <div className="flex items-center gap-4">
          {/* Tombol Dark Mode Desktop */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-yellow-400"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-xl transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {nama || user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-white dark:border-gray-800">
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
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-2 rounded-xl font-medium text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* MOBILE APP HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/profile" className="block">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-white dark:border-gray-800">
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
              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {nama || "Pengguna"}
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium capitalize">
                {role === "admin" ? "Administrator" : "Cashier"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Tombol Dark Mode Mobile */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-yellow-400 active:scale-95"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 active:scale-95"
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
