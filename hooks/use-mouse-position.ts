"use client";

import { useState, useEffect } from "react";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // ページ全体での絶対位置を取得（スクロール位置を含む）
      const x = e.pageX || e.clientX + window.scrollX;
      const y = e.pageY || e.clientY + window.scrollY;
      setMousePosition({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        // ページ全体での絶対位置を取得（スクロール位置を含む）
        const x = touch.pageX || touch.clientX + window.scrollX;
        const y = touch.pageY || touch.clientY + window.scrollY;
        setMousePosition({ x, y });
      }
    };

    // スクロール時にもマウス位置を更新
    const handleScroll = () => {
      // 最後のマウス位置を保持して、スクロール時に更新
      setMousePosition(prev => ({
        x: prev.x,
        y: prev.y
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return mousePosition;
}