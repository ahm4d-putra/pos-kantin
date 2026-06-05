import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "kasir") return <Navigate to="/kasir/dashboard" />;
    return <Navigate to="/" />;
  }
  return children;
};

const MainLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <DashboardAdmin />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/barang"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <DataBarang />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/laporan-stok"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <LaporanStok />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/laporan-penjualan"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <LaporanPenjualan />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kasir/dashboard"
            element={
              <ProtectedRoute allowedRoles={["kasir"]}>
                <MainLayout>
                  <DashboardKasir />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kasir/transaksi"
            element={
              <ProtectedRoute allowedRoles={["kasir"]}>
                <MainLayout>
                  <Transaksi />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
