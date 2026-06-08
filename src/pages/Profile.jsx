import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestore";
import { updateUserEmailAuth } from "../firebase/auth";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, nama, photoURL, fetchUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        nama: nama || "",
        email: user.email || "",
        photoURL: photoURL || "",
      });
    }
  }, [user, nama, photoURL]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama) return alert("Nama tidak boleh kosong!");

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (formData.email !== user.email) {
        await updateUserEmailAuth(user, formData.email);
      }
      await updateUserProfile(user.uid, {
        nama: formData.nama,
        photoURL: formData.photoURL,
      });
      await fetchUserProfile(user.uid);
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
    } catch (error) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "Untuk mengubah email, silakan logout lalu login kembali sebelum edit profil.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Gagal memperbarui profil: " + error.message,
        });
      }
    }
    setLoading(false);
  };

  const inputStyle =
    "block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm";

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Profil Saya
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-lg flex items-center justify-center relative group">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-400 dark:text-gray-500" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Edit */}
        <form onSubmit={handleSubmit} className="p-6 pt-16 space-y-5">
          {message.text && (
            <div
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${message.type === "error" ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="name@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              *Mengubah email akan meminta Anda login ulang di perangkat lain.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Link Foto Profil
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Camera
                  size={18}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                className={inputStyle}
                placeholder="https://contoh-gambar.com/foto.jpg"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload gambar ke ImgBB/PostImage lalu paste link Direct-nya di
              sini.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 dark:shadow-blue-900/30 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
