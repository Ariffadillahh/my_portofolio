import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-center px-4">

            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 space-y-6">
                <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tighter drop-shadow-sm">
                    404
                </h1>

                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base">
                        Maaf, halaman yang kamu cari mungkin telah dihapus, diubah namanya, atau sementara tidak tersedia.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}