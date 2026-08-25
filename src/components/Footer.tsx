import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import type { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/heitormaker3d/';

  return (
    <footer className="mt-16 w-full bg-white border-t border-slate-200 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

        {/* COLUNA 1: LOGO DESTAQUE E NOME AMPLIADO (5 de 12 colunas) */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-4">
            <img
              src="./logo-badge.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './logo.png';
              }}
              alt="H-Maker 3D Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md transition-transform hover:scale-105 flex-shrink-0"
            />
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                {settings.storeName}
              </span>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Brinquedos, Chaveiros & Pedidos 3D 🚀
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA 2: REDES SOCIAIS & CONTATO WHATSAPP LADO A LADO (4 de 12 colunas) */}
        <div className="md:col-span-4 space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Redes Sociais & Contato</h4>
          <p className="text-slate-500 text-xs">Siga o Heitor no Instagram e faça seu orçamento no WhatsApp!</p>
          
          <div className="flex flex-row items-center gap-3 pt-1">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold hover:opacity-95 shadow-md shadow-pink-200 transition-all hover:scale-105 whitespace-nowrap"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@heitormaker3d</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all hover:scale-105 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp 💬</span>
            </a>
          </div>
        </div>

        {/* COLUNA 3: ÁREA DE CONTROLE (3 de 12 colunas) */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Área de Controle</h4>
          <ul className="space-y-2 font-medium">
            <li>
              <button onClick={onOpenAdmin} className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors">
                Painel Admin dos Pais / Maker 🔒
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-medium">
        <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" /> pelo H-Maker com a ajuda do papai 🚀
        </p>
      </div>
    </footer>
  );
};
