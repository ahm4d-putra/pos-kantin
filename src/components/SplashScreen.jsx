import { ShoppingCart, Loader2 } from "lucide-react";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animasi bulatan latar belakang */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4 animate-pulse"></div>

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 animate-bounce">
          <div className="bg-white/20 backdrop-blur-sm w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
            <ShoppingCart size={64} className="text-white drop-shadow-lg" />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
          KantinPOS
        </h1>

        <p className="text-blue-200 text-lg font-light mb-10">
          Sistem Point of Sale Modern
        </p>

        <div className="flex items-center gap-3 text-white/80">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm font-medium tracking-widest uppercase">
            Memuat Sistem...
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
