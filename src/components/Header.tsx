import React from 'react';
import { Rocket, Search, ShieldLock, MessageSquare, Sparkles } from 'lucide-react';
import type { StoreSettings } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin: () => void;
  settings: StoreSettings;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  settings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* LOGO & BRANDING H-MAKER */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-cyan-400 shadow-md shadow-indigo-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Rocket className="w-6 h-6 text-white transform group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
                H-MAKER
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> 3D Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Brinquedos, Chaveiros & Pedidos 3D 🚀</p>
          </div>
        </div>

        {/* CAMPO DE BUSCA RÁPIDA */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar brinquedos 3D, chaveiros, dinossauros..."
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner"
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

        {/* BOTÕES DE AÇÃO E ADMIN */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs hover:scale-105"
          >
            <ShieldLock className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Painel Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
