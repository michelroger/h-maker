import React from 'react';
import { Box, ShieldCheck, Lightbulb, Gift } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-4 border-amber-800/70 p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl text-white">
      {/* Luzes sutis de fundo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LADO ESQUERDO: SOBRE O HEITOR */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* TÍTULO PRINCIPAL: "Sobre o Heitor" */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Sobre o{' '}
              <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                Heitor
              </span>
            </h1>
          </div>

          {/* DIVISOR METÁLICO COM ENGRENAGEM */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-cyan-500/80 via-amber-600/80 to-transparent" />
            <div className="w-6 h-6 rounded-full bg-amber-700/80 border border-amber-500 flex items-center justify-center text-amber-300 text-xs shadow-md">
              ⚙️
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-cyan-500/80 via-amber-600/80 to-transparent" />
          </div>

          {/* SUBTÍTULO E TEXTO DA MENSAGEM */}
          <div className="space-y-3 text-slate-200 text-sm sm:text-base font-normal leading-relaxed">
            <h3 className="text-cyan-400 font-bold text-base sm:text-lg flex items-center gap-1.5">
              <span>✧</span> Oi! Eu sou o Heitor!
            </h3>
            
            <p className="font-medium text-slate-100">
              Criando e descobrindo tudo o que podemos fazer com a Impressão 3D!
            </p>

            <p className="text-slate-300 text-xs sm:text-sm">
              Recentemente ganhei uma impressora 3D! Desde então, estou amando criar, experimentar e descobrir todas as coisas legais que podemos fazer com ela.
            </p>

            <p className="text-slate-300 text-xs sm:text-sm">
              Aqui, você encontra modelos 3D testados e aprovados por mim, feitos para brincar, presentear, organizar e aprender. Espero que minhas criações tragam um pouquinho de diversão para o seu dia!
            </p>

            <p className="font-bold text-white text-xs sm:text-sm pt-1">
              Obrigado por apoiar o meu trabalho e o meu pequeno negócio!
            </p>
          </div>

        </div>

        {/* LADO DIREITO: ILUSTRAÇÃO DO HEITOR E PAINEL DE RECURSOS */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* MOLDURA DO AVATAR DO HEITOR */}
          <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950/80 shadow-2xl p-2 group hover:border-cyan-400 transition-all">
            <img
              src="./heitor-avatar.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './logo-badge.png';
              }}
              alt="Heitor Pires com Impressora 3D"
              className="w-full h-auto max-h-72 object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* PAINEL INFERIOR COM OS 4 ÍCONES CYAN */}
          <div className="w-full max-w-xs sm:max-w-sm mt-4 p-3 rounded-2xl border border-cyan-500/40 bg-slate-950/80 shadow-xl grid grid-cols-4 gap-2 text-center text-cyan-400">
            
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-cyan-500/10 transition-colors">
              <Box className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[9px] font-black uppercase text-white leading-tight">
                MODELOS TESTADOS
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-cyan-500/10 transition-colors">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[9px] font-black uppercase text-white leading-tight">
                APROVADOS POR MIM
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-cyan-500/10 transition-colors">
              <Lightbulb className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[9px] font-black uppercase text-white leading-tight">
                CRIAR & APRENDER
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-cyan-500/10 transition-colors">
              <Gift className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[9px] font-black uppercase text-white leading-tight">
                BRINCAR & PRESENTEAR
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
