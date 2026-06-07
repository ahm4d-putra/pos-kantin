import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardKasir from "./pages/DashboardKasir";
import DataBarang from "./pages/DataBarang";
import LaporanStok from "./pages/LaporanStok";
import LaporanPenjualan from "./pages/LaporanPenjualan";
import Transaksi from "./pages/Transaksi";
import Profile from "./pages/Profile"; // Import Halaman Profile
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import SplashScreen from "./components/SplashScreen";

const ProtectedRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <SplashScreen />;
  if (!user) return <Navigate to="/" />;
  return children;
};

const RoleRedirect = () => {
  const { role } = useAuth();
  if (role === "admin") return <Navigate to="/admin/dashboard" />;
  if (role === "kasir") return <Navigate to="/kasir/dashboard" />;
  return <Navigate to="/" />;
};

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <div
          className={`transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full lg:translate-y-0"}`}
        >
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        <main className="flex-1 overflow-y-auto pb-28 lg:pb-0 p-4 md:p-6">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

const AppRoutes = () => {
  const { loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) return <SplashScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardAdmin />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/barang"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DataBarang />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan-stok"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LaporanStok />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan-penjualan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LaporanPenjualan />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Kasir Routes */}
        <Route
          path="/kasir/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardKasir />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kasir/transaksi"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transaksi />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile Route (Bisa diakses Admin & Kasir) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />
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
