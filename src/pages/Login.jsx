import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginWithEmail } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Mail, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, role } = useAuth();
  const navigate = useNavigate();

  if (user && role === "admin") navigate("/admin/dashboard");
  if (user && role === "kasir") navigate("/kasir/dashboard");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email dan password wajib diisi!");

    setLoading(true);
    try {
      const userCredential = await loginWithEmail(email, password);
      const { getUserRole } = await import("../firebase/firestore");
      const userData = await getUserRole(userCredential.user.uid);

      if (!userData) {
        setError(
          "Akun ditemukan, tapi data role belum diatur di Database (Firestore).",
        );
      } else if (!userData.role) {
        setError(
          "Data user ditemukan, tapi field 'role' belum diisi di Firestore.",
        );
      }
    } catch (err) {
      console.error(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Email atau password salah!");
      } else if (err.code === "auth/user-not-found") {
        setError("Akun tidak ditemukan!");
      } else {
        setError("Gagal login: " + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Bagian Kiri - Branding (Hidden di HP) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <ShoppingCart size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            KantinPOS
          </h1>
          <p className="text-xl font-light opacity-90">
            Sistem Point of Sale Modern untuk Manajemen Kantin Sekolah yang
            Lebih Efisien.
          </p>
        </div>
      </div>

      {/* Bagian Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo di HP */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md">
              <ShoppingCart size={32} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang
          </h2>
          <p className="text-gray-500 mb-8">
            Silakan masuk ke akun Anda untuk melanjutkan.
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3 text-sm">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Memproses...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
