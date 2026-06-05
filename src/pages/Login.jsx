import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginWithEmail } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          POS Kantin Sekolah
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
