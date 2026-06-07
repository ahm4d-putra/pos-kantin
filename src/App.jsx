import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Tambahkan useEffect
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardKasir from "./pages/DashboardKasir";
import DataBarang from "./pages/DataBarang";
import LaporanStok from "./pages/LaporanStok";
import LaporanPenjualan from "./pages/LaporanPenjualan";
import Transaksi from "./pages/Transaksi";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <SplashScreen />;
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "kasir") return <Navigate to="/kasir/dashboard" />;
    return <Navigate to="/" />;
  }
  return children;
};

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { loading } = useAuth();
  
  // State buat nahan splash screen biar keliatan lebih lama
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Bikin delay minimal 2.5 detik (2500ms) biar splash screen keliatan
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Splash screen bakal ilang kalau Firebase UDAH selesai loading DAN timer 2.5 detik UDAH habis
  if (loading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><DashboardAdmin /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/barang" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><DataBarang /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/laporan-stok" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><LaporanStok /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/laporan-penjualan" element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout><LaporanPenjualan /></MainLayout></ProtectedRoute>} />
        <Route path="/kasir/dashboard" element={<ProtectedRoute allowedRoles={["kasir"]}><MainLayout><DashboardKasir /></MainLayout></ProtectedRoute>} />
        <Route path="/kasir/transaksi" element={<ProtectedRoute allowedRoles={["kasir"]}><MainLayout><Transaksi /></MainLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;