"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { useUserId } from "@/hooks/use-user-id";

interface CursorData {
  x: number;
  y: number;
  timestamp: number;
  isActive?: boolean;
}

interface CursorsData {
  [userId: string]: CursorData;
}

// ユーザーIDから色を生成する関数
function generateColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

// 遊び心のある絵文字カーソル
function getRandomEmoji(userId: string): string {
  const emojis = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐸', '🦄', '🌟', '⭐', '💫', '🎯', '🎨', '🎪', '🎭', '🎮'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return emojis[Math.abs(hash) % emojis.length];
}

export default function OtherCursors() {
  const [cursors, setCursors] = useState<CursorsData>({});
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const userId = useUserId();

  // スクロール位置を追跡
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初期スクロール位置を設定
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const cursorsRef = ref(database, 'cursors');
    
    const handleValue = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        // 自分のカーソルを除外し、非アクティブまたは古いデータを削除
        const filteredData: CursorsData = {};
        const now = Date.now();
        const cleanupPromises: Promise<void>[] = [];
        
        Object.keys(data).forEach(key => {
          const cursor = data[key];
          const isOld = (now - cursor.timestamp) > 10000; // 10秒以上古い
          const isInactive = cursor.isActive === false;
          
          if (key !== userId && !isOld && !isInactive) {
            filteredData[key] = data[key];
          } else if (key !== userId && (isOld || isInactive)) {
            // 古いデータまたは非アクティブなデータを削除
            cleanupPromises.push(remove(ref(database, `cursors/${key}`)));
          }
        });
        
        // クリーンアップを実行
        Promise.all(cleanupPromises).catch(console.error);
        
        setCursors(filteredData);
      } else {
        setCursors({});
      }
    };

    onValue(cursorsRef, handleValue);

    return () => {
      off(cursorsRef, 'value', handleValue);
    };
  }, [userId]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Object.entries(cursors).map(([id, cursor]) => {
        // 絶対位置からスクロール位置を引いて、現在のビューポートでの相対位置を計算
        const relativeX = cursor.x - scrollPosition.x;
        const relativeY = cursor.y - scrollPosition.y;
        
        // ビューポート内にあるかどうかを確認
        const isInViewport = relativeX >= -100 && relativeX <= window.innerWidth + 100 &&
                           relativeY >= -100 && relativeY <= window.innerHeight + 100;
        
        // ビューポート外の場合は表示しない
        if (!isInViewport) return null;

        return (
          <div 
            key={id}
            className="absolute transition-all duration-75 ease-out transform -translate-x-2 -translate-y-2"
            style={{
              left: relativeX,
              top: relativeY,
            }}
          >
            {/* メインカーソル */}
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
              style={{ backgroundColor: generateColor(id) }}
            />
            
            {/* 遊び心のある絵文字 */}
            <div className="absolute -top-6 -left-2 text-lg animate-bounce">
              {getRandomEmoji(id)}
            </div>
            
            {/* ユーザー情報 */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs rounded whitespace-nowrap">
              ユーザー {id.substring(0, 8)}
            </div>
            
            {/* トレイル効果 */}
            <div 
              className="absolute w-8 h-8 rounded-full opacity-20 animate-ping"
              style={{ 
                backgroundColor: generateColor(id),
                left: -8,
                top: -8
              }}
            />
          </div>
        );
      })}
    </div>
  );
}