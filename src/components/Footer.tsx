import React from 'react';
import { Rocket, Heart, MessageSquare, ShieldCheck, GitBranch } from 'lucide-react';
import type { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="mt-16 w-full bg-white border-t border-slate-200 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">{settings.storeName}</span>
          </div>

          <p className="text-slate-600 max-w-md font-medium leading-relaxed">
            Vitrine e gerador de orçamentos de impressões 3D sob medida pelo pequeno H-Maker (7 anos). 
            Brinquedos articulados, chaveiros com nome e decorações incríveis!
          </p>

          <div className="flex items-center gap-2 pt-1 text-slate-500 font-bold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Painel Administrativo com Criptografia Segura</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Atendimento WhatsApp</h4>
          <p className="text-slate-500">Solicite orçamentos para arquivos STL próprios ou modelos da nossa vitrine.</p>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enviar Mensagem 💬</span>
          </a>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Área de Controle</h4>
          <ul className="space-y-2 font-medium">
            <li>
              <button onClick={onOpenAdmin} className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                Painel Admin dos Pais / Maker 🔒
              </button>
            </li>
            <li>
              <a
                href="https://github.com/michelroger/h-maker"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Hospedado no GitHub Pages</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-medium">
        <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Feito com <Heart className="w-4 h-4 text-indigo-600 fill-indigo-600" /> pelo H-Maker (7 anos) com a ajuda do papai 🚀
        </p>
      </div>
    </footer>
  );
};
