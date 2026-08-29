'use client'

import React, { useState, useEffect } from 'react'
import { Camera, Cpu, Battery, Zap, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
  icon: React.ReactNode;
}

const hotspots: Hotspot[] = [
  {
    id: 'camera',
    x: 35,
    y: 20,
    title: 'Camera 200MP Siêu Nét',
    description: 'Cụm camera chuyên nghiệp với cảm biến 1 inch, zoom quang học 10x và hỗ trợ quay video 8K. Chụp ảnh thiếu sáng đỉnh cao.',
    icon: <Camera className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'cpu',
    x: 50,
    y: 50,
    title: 'Vi xử lý Snapdragon 8 Gen 3',
    description: 'Sức mạnh vượt trội với tiến trình 4nm, xử lý mượt mà mọi tựa game AAA và ứng dụng nặng nhất.',
    icon: <Cpu className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'battery',
    x: 50,
    y: 75,
    title: 'Pin 5000mAh & Sạc siêu tốc',
    description: 'Sử dụng cả ngày dài không lo hết pin. Sạc từ 0-100% chỉ trong 25 phút với công nghệ sạc 120W.',
    icon: <Zap className="w-5 h-5 text-yellow-400" />
  }
];

export function InteractivePhoneReveal({ onClose }: { onClose: () => void }) {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-700",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 h-full">
        
        {/* Left Side: Info Text */}
        <div className={cn(
          "md:w-1/3 text-white text-center md:text-left transition-all duration-700 delay-300 transform",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        )}>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Thiết kế của tương lai
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Khám phá từng chi tiết tinh xảo trên tuyệt tác công nghệ mới nhất. Nhấn vào các điểm sáng để xem cấu hình chi tiết.
          </p>
          
          {/* Detailed Info Card that appears when a hotspot is clicked */}
          <div className="min-h-[200px]">
            {activeSpot ? (
              <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-800 rounded-xl">
                    {hotspots.find(h => h.id === activeSpot)?.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {hotspots.find(h => h.id === activeSpot)?.title}
                  </h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {hotspots.find(h => h.id === activeSpot)?.description}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 border border-dashed border-slate-700 rounded-2xl p-6">
                <ChevronDown className="w-8 h-8 mb-2 animate-bounce" />
                <p>Chọn một điểm trên điện thoại</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Phone */}
        <div className={cn(
          "relative flex items-center justify-center transition-all duration-1000 transform",
          isLoaded ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 -rotate-12"
        )}>
          {/* Glowing background behind phone */}
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full w-[120%] h-[120%] -left-[10%] -top-[10%] animate-pulse z-0" />
          
          {/* CSS Phone Model */}
          <div className="relative z-10 w-[280px] h-[580px] md:w-[320px] md:h-[650px] bg-gradient-to-b from-slate-800 to-slate-950 rounded-[3rem] border-[8px] border-slate-700 shadow-2xl flex flex-col items-center overflow-hidden ring-1 ring-slate-800/50">
            
            {/* Phone Screen/Back details */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
            
            {/* Camera Cluster */}
            <div className="absolute top-8 left-6 w-32 h-40 bg-slate-950 rounded-[2rem] border border-slate-700/50 shadow-inner flex flex-wrap p-3 gap-2 justify-between">
              {/* Main Lens */}
              <div className="w-[3.5rem] h-[3.5rem] bg-black rounded-full border-2 border-slate-600 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] flex items-center justify-center">
                <div className="w-6 h-6 bg-slate-800 rounded-full border border-slate-700"></div>
              </div>
              {/* Second Lens */}
              <div className="w-[3.5rem] h-[3.5rem] bg-black rounded-full border-2 border-slate-600 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] flex items-center justify-center">
                <div className="w-5 h-5 bg-slate-800 rounded-full border border-slate-700"></div>
              </div>
              {/* Third Lens */}
              <div className="w-12 h-12 mt-2 ml-1 bg-black rounded-full border border-slate-700 shadow-[inset_0_0_8px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
              </div>
              {/* Flash */}
              <div className="w-6 h-6 mt-4 bg-yellow-100/90 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.6)]"></div>
            </div>

            {/* Brand Logo (e.g. Apple/Samsung style middle icon) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-40">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-white to-slate-400 mb-2"></div>
              <span className="text-xs font-bold tracking-[0.3em] text-white">TECHSTORE</span>
            </div>

            {/* Phone Reflections */}
            <div className="absolute top-0 right-0 w-[150%] h-[20%] bg-gradient-to-b from-white/10 to-transparent transform rotate-45 -translate-y-20 translate-x-10"></div>

            {/* Hotspots */}
            {hotspots.map((spot) => {
              const isActive = activeSpot === spot.id;
              return (
                <div 
                  key={spot.id}
                  className="absolute z-20 group"
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                >
                  <button
                    onClick={() => setActiveSpot(spot.id)}
                    className={cn(
                      "relative flex items-center justify-center w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
                      isActive ? "scale-110" : "hover:scale-110"
                    )}
                  >
                    <span className={cn(
                      "absolute inset-0 rounded-full animate-ping opacity-75",
                      isActive ? "bg-blue-400" : "bg-white/50 group-hover:bg-blue-400/80"
                    )}></span>
                    <span className={cn(
                      "relative w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]",
                      isActive ? "bg-blue-400 ring-4 ring-blue-400/30" : "bg-white ring-2 ring-white/50"
                    )}></span>
                  </button>
                  
                  {/* Tooltip on hover (desktop only) */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-black/80 text-white text-sm whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity backdrop-blur-md hidden md:block">
                    {spot.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
