import React, { useState } from 'react';
import { Search, MessageSquare, X } from 'lucide-react';
import type { StoreSettings } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin: () => void;
  settings: StoreSettings;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  settings,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/heitormaker3d/';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        
        {/* LOGO OFICIAL DO TEXTO H-MAKER */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <img
            src="./logo-text.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './logo.png';
            }}
            alt="H-MAKER"
            className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
          />
        </div>

        {/* CAMPO DE BUSCA RÁPIDA (DESKTOP) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar brinquedos 3D, chaveiros, dinossauros..."
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* BOTÕES INSTAGRAM, WHATSAPP E BUSCA MOBILE */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão de Busca Mobile */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all"
            title="Buscar"
          >
            <Search className="w-4 h-4 text-cyan-600" />
          </button>

          {/* Botão Instagram Oficial */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all hover:scale-105"
            title="Instagram @heitormaker3d"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden sm:inline">@heitormaker3d</span>
          </a>

          {/* Botão WhatsApp */}
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline">Falar no WhatsApp</span>
            <span className="lg:hidden">WhatsApp</span>
          </a>
        </div>

      </div>

      {/* CAMPO DE BUSCA EXPANDIDO PARA CELULAR */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar brinquedos 3D, chaveiros..."
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-10 py-2.5 border border-slate-200 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            <button
              onClick={() => {
                onSearchChange('');
                setIsMobileSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
