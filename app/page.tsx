"use client";

import { useIrigasiStatus } from "@/hooks/useIrigasiStatus";
import type { IrigasiStatus, ConnectionStatus } from "@/hooks/useIrigasiStatus";

function formatTime(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function ConnectionBadge({
  status,
}: {
  status: ConnectionStatus;
}) {
  const dot = {
    loading: "bg-yellow-400",
    online: "bg-emerald-400 animate-pulse-dot",
    offline: "bg-zinc-500",
    error: "bg-red-500",
  }[status];

  const label = {
    loading: "Menghubungkan...",
    online: "Device Online",
    offline: "Device Offline",
    error: "Error",
  }[status];

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400">
      {status === "online" && (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 animate-live-pulse">
          ⚡ Live
        </span>
      )}
      <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
      {label}
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  accent,
  icon,
  flashKey,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent: "green" | "teal" | "orange" | "red" | "blue" | "purple";
  icon: string;
  flashKey?: number;
}) {
  const accentColors = {
    green: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    teal: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    orange: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    red: "text-red-400 border-red-500/30 bg-red-500/10",
    blue: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    purple: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-5 backdrop-blur-sm transition-colors hover:border-zinc-600/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${accentColors[accent]}`}>
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span key={flashKey} className="text-3xl font-bold tracking-tight text-white animate-data-flash">{value}</span>
        {unit && <span className="text-sm text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  active,
  activeLabel,
  inactiveLabel,
  activeColor,
  inactiveColor,
}: {
  label: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeColor: string;
  inactiveColor: string;
}) {
  const isActive = active;
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-5 backdrop-blur-sm">
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            isActive ? activeColor : inactiveColor
          }`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              isActive ? "bg-white" : "bg-zinc-500"
            }`}
          />
          {isActive ? activeLabel : inactiveLabel}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="text-5xl">📡</div>
      <h2 className="text-xl font-semibold text-zinc-300">
        Menunggu Data Pertama
      </h2>
      <p className="max-w-sm text-sm text-zinc-500">
        Device irigasi belum pernah mengirim data. Pastikan Wemos D1 Mini
        terhubung ke internet dan menyala. Data akan muncul otomatis begitu
        board mulai mengirim.
      </p>
    </div>
  );
}

function ConfigErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="text-5xl">⚙️</div>
      <h2 className="text-xl font-semibold text-red-400">
        Konfigurasi Firebase Tidak Lengkap
      </h2>
      <pre className="max-w-md whitespace-pre-wrap rounded-lg bg-zinc-800/80 p-4 text-left text-sm text-red-300">
        {message}
      </pre>
      <p className="text-sm text-zinc-500">
        Salin file <code className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">.env.local.example</code>{" "}
        menjadi <code className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">.env.local</code> dan isi dengan
        konfigurasi Firebase dari console.
      </p>
    </div>
  );
}

function DashboardContent({ data, lastUpdated, connectionStatus }: { data: IrigasiStatus; lastUpdated: Date | null; connectionStatus: ConnectionStatus }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Irigasi Prediktif
          </h1>
          <p className="text-sm text-zinc-500">
            Monitoring realtime sistem irigasi otomatis
          </p>
        </div>
        <ConnectionBadge status={connectionStatus} />
      </div>

      {/* Grid kartu */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Baris 1: Status Utama — 2 kolom lebar di LG */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusBadge
            label="Pompa Air"
            active={data.pompa_aktif}
            activeLabel="AKTIF"
            inactiveLabel="MATI"
            activeColor="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            inactiveColor="bg-zinc-700/50 text-zinc-400 border border-zinc-600/50"
          />
          <StatusBadge
            label="Kondisi Tanah"
            active={!data.tanah_kering}
            activeLabel="BASAH"
            inactiveLabel="KERING"
            activeColor="bg-blue-500/20 text-blue-300 border border-blue-500/30"
            inactiveColor="bg-orange-500/20 text-orange-300 border border-orange-500/30"
          />
        </div>

        {/* Kartu Prediksi Hujan */}
        <div className="col-span-1 flex flex-col gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-5 backdrop-blur-sm">
          <span className="text-sm font-medium text-zinc-400">Prediksi Hujan</span>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                data.prediksi_hujan
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-zinc-700/50 text-zinc-400 border border-zinc-600/50"
              }`}
            >
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  data.prediksi_hujan ? "bg-blue-400" : "bg-zinc-500"
                }`}
              />
              {data.prediksi_hujan ? "Ya, diperkirakan hujan" : "Tidak ada hujan"}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-600">
            Berdasarkan tren tekanan udara (BMP180)
          </p>
        </div>

        {/* Baris 2: Sensor Lingkungan */}
        <StatCard
          label="Suhu"
          value={data.suhu.toFixed(1)}
          unit="°C"
          accent="orange"
          icon="🌡️"
          flashKey={data.timestamp}
        />
        <StatCard
          label="Kelembapan Udara"
          value={data.kelembapan.toFixed(1)}
          unit="%"
          accent="blue"
          icon="💧"
          flashKey={data.timestamp}
        />
        <StatCard
          label="Tekanan Udara"
          value={data.tekanan_udara.toFixed(1)}
          unit="hPa"
          accent="purple"
          icon="🌪️"
          flashKey={data.timestamp}
        />

        {/* Baris 3: Soil Raw */}
        <StatCard
          label="Soil Raw"
          value={data.soil_state}
          unit="/ 1023"
          accent="teal"
          icon="🌱"
          flashKey={data.timestamp}
        />
      </div>

      {/* Footer: Last Updated + Timestamp device */}
      <div className="mt-6 flex flex-col gap-1 text-xs text-zinc-600">
        <p>
          Last updated:{" "}
          <span className="text-zinc-400">{formatTime(lastUpdated)}</span>{" "}
          <span className="text-zinc-700">(client time)</span>
        </p>
        <p>
          Device uptime:{" "}
          <span className="text-zinc-500">
            {data.timestamp} detik sejak boot
          </span>
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { data, loading, connectionStatus, lastUpdated, error } =
    useIrigasiStatus();

  // Error config Firebase
  if (error && !data) {
    // Bedain error config vs error koneksi
    if (error.includes("Firebase config")) {
      return (
        <div className="flex min-h-dvh flex-col bg-background font-sans">
          <ConfigErrorState message={error} />
        </div>
      );
    }
    return (
      <div className="flex min-h-dvh flex-col bg-background font-sans">
        <DashboardContent
          lastUpdated={lastUpdated}
          connectionStatus={connectionStatus}
          data={{
            kelembapan: 0,
            pompa_aktif: false,
            prediksi_hujan: false,
            soil_state: 0,
            suhu: 0,
            tanah_kering: false,
            tekanan_udara: 0,
            timestamp: 0,
          }}
        />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col bg-background font-sans">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="h-7 w-48 animate-pulse rounded-lg bg-zinc-800" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-800/50" />
            </div>
            <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl bg-zinc-800/40"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state — device belum pernah kirim data
  if (!data) {
    return (
      <div className="flex min-h-dvh flex-col bg-background font-sans">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Irigasi Prediktif
            </h1>
            <ConnectionBadge status={connectionStatus} />
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans">
      <DashboardContent data={data} lastUpdated={lastUpdated} connectionStatus={connectionStatus} />
    </div>
  );
}
