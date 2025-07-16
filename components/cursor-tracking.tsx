"use client";

import { useEffect, useRef } from "react";
import { ref, set, onDisconnect } from "firebase/database";
import { database } from "@/lib/firebase";
import { useUserId } from "@/hooks/use-user-id";
import { useMousePosition } from "@/hooks/use-mouse-position";

export default function CursorTracking() {
  const userId = useUserId();
  const mousePosition = useMousePosition();
  const lastUpdateRef = useRef<number>(0);
  const userRefRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    if (!userRefRef.current) {
      userRefRef.current = ref(database, `cursors/${userId}`);
      
      // 接続が切れたときにデータを削除（ページを閉じた時など）
      onDisconnect(userRefRef.current).remove();
      
      // ページを離れる時の処理
      const handleBeforeUnload = () => {
        set(userRefRef.current, null);
      };
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          set(userRefRef.current, null);
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (userRefRef.current) {
          set(userRefRef.current, null);
        }
      };
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || !userRefRef.current) return;
    
    // スロットリング処理（16ms = 60fps）
    const now = Date.now();
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;
    
    // マウス位置を更新（完璧な同期処理）
    set(userRefRef.current, {
      x: mousePosition.x,
      y: mousePosition.y,
      timestamp: now,
      isActive: true
    }).catch((error) => {
      console.error("Failed to update cursor position:", error);
    });
  }, [userId, mousePosition.x, mousePosition.y]);

  return null;
}