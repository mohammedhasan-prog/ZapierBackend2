"use client";
import React from "react";

export default function ZapCell({
  name,
  index,
  onClick,
  image,
}: {
  name?: string;
  index: number;
  onClick: () => void;
  image?: string;
}) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg bg-white p-4 w-80 flex items-center justify-between cursor-pointer hover:shadow-lg hover:border-amber-500/50 hover:ring-2 hover:ring-amber-500/20 transition-all duration-300 group relative z-10 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
            <div className="font-bold text-xs bg-slate-100 text-slate-500 w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors border border-slate-200">
            {index}
            </div>
            {/* Optional connecting line hint inside the number or similar? Keeping it simple. */}
        </div>
        
        {image && (
           <div className="w-10 h-10 p-1 bg-white rounded-md border border-gray-100 flex items-center justify-center">
                <img src={image} alt={name} className="w-full h-full object-contain" />
           </div>
        )}
        
        <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-amber-700 transition-colors">{name}</span>
            <span className="text-xs text-gray-400 capitalize">{index === 1 ? "Trigger" : "Action"}</span>
        </div>
      </div>
      
      <div className="text-gray-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </div>
  );
}

