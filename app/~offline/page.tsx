"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#0f172a] px-6 text-center font-sans">
      <div className="text-6xl">📡</div>
      <h1 className="text-2xl font-bold text-zinc-100">
        Tidak Ada Koneksi
      </h1>
      <p className="max-w-sm text-sm text-zinc-400">
        Dashboard irigasi membutuhkan koneksi internet untuk menampilkan data
        realtime dari Firebase. Periksa koneksi kamu dan coba lagi.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-lg bg-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
      >
        Coba Lagi
      </button>
    </div>
  );
}
