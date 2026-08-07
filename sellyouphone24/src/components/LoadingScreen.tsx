"use client";

import React from "react";

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  fullScreen = true,
}: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/10 backdrop-blur-sm transition-opacity duration-200 pointer-events-auto"
    : "relative w-full min-h-[200px] flex items-center justify-center bg-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-500/10";

  return (
    <div className={containerClasses}>
      {/* Very subtle light blur overlay (4px blur, 10% tint) with minimal grey spinner */}
      <div className="w-8 h-8 rounded-full border-2 border-gray-400/30 border-t-gray-600 animate-spin" />
    </div>
  );
}
