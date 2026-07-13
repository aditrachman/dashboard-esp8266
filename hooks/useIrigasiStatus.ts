"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ref, onValue, DataSnapshot } from "firebase/database";
import { getRealtimeDatabase } from "@/lib/firebase";

export interface IrigasiStatus {
  kelembapan: number;
  pompa_aktif: boolean;
  prediksi_hujan: boolean;
  soil_raw: number;
  suhu: number;
  tanah_kering: boolean;
  tekanan_udara: number;
  /** ⚠️ BUKAN epoch!
   *  Ini adalah uptime device dalam detik sejak Wemos D1 Mini boot.
   *  JANGAN dipakai sebagai timestamp real-time.
   *  Untuk last updated, gunakan client-side timestamp saat data diterima. */
  timestamp: number;
}

export type ConnectionStatus = "loading" | "online" | "offline" | "error";

export interface IrigasiStatusResult {
  data: IrigasiStatus | null;
  loading: boolean;
  connectionStatus: ConnectionStatus;
  lastUpdated: Date | null;
  error: string | null;
}

/**
 * Batas waktu (dalam ms) sejak data terakhir diterima sebelum
 * dianggap device offline. Device ngirim data tiap 2 detik,
 * jadi 10 detik tanpa update = almost certainly offline.
 */
const OFFLINE_THRESHOLD_MS = 10_000;

export function useIrigasiStatus(): IrigasiStatusResult {
  const [data, setData] = useState<IrigasiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Ref untuk track interval offline checker
  const lastUpdateRef = useRef<number>(0);
  const isFirstData = useRef(true);

  useEffect(() => {
    let db;
    try {
      db = getRealtimeDatabase();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Gagal inisialisasi Firebase"
      );
      setConnectionStatus("error");
      return;
    }

    const statusRef = ref(db, "irigasi/status");

    const handleData = (snapshot: DataSnapshot) => {
      const val = snapshot.val();
      if (val === null) {
        // Data pernah ada tapi sekarang null (path dihapus)
        setData(null);
        setConnectionStatus("offline");
        return;
      }

      const now = Date.now();
      lastUpdateRef.current = now;
      setLastUpdated(new Date(now));
      setData(val as IrigasiStatus);
      setConnectionStatus("online");
      isFirstData.current = false;
    };

    // Subscribe ke Realtime Database
    // Firebase v9+ modular: cancelCallback dikirim via options object
    const unsubscribe = onValue(
      statusRef,
      handleData,
      (err: Error) => {
        setError(err.message);
        setConnectionStatus("error");
      }
    );

    // Interval checker: deteksi device offline
    const intervalId = setInterval(() => {
      if (isFirstData.current) return; // masih nunggu data pertama
      const elapsed = Date.now() - lastUpdateRef.current;
      if (elapsed > OFFLINE_THRESHOLD_MS) {
        setConnectionStatus("offline");
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  return {
    data,
    loading: data === null && error === null,
    connectionStatus,
    lastUpdated,
    error,
  };
}
