import React from 'react';
import { Sparkles, Heart, Rocket, Smile, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 text-white p-6 sm:p-10 mb-8 shadow-xl shadow-indigo-100">
      {/* Círculos decorativos luminosos */}
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LADO ESQUERDO: MENSAGEM DO HEITOR PIRES */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>CONHEÇA O PEQUENO MAKER • HEITOR PIRES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
            Oi! Eu sou o Heitor! 🚀
          </h1>

          <div className="space-y-3 text-sky-50 text-sm sm:text-base font-medium leading-relaxed drop-shadow-xs max-w-2xl">
            <p>
              Recentemente ganhei uma impressora 3D! Desde então, estou amando criar, experimentar e descobrir tudo o que podemos fazer com ela.
            </p>
            <p>
              Aqui no site, você encontra modelos 3D testados e aprovados por mim, feitos especialmente para brincar, presentear, organizar e aprender. Espero que você encontre algo que goste e que minhas criações tragam um pouquinho de diversão para o seu dia!
            </p>
            <p className="font-bold text-white">
              Obrigado por apoiar o meu trabalho e pequeno negócio!
            </p>
          </div>

          {/* CARD DE ASSINATURA DO HEITOR */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/95 text-slate-800 font-extrabold text-sm shadow-md border border-white/40">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
              <span>Com carinho, <span className="text-indigo-600">Heitor Pires</span></span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-sky-100">
              <CheckCircle2 className="w-4 h-4 text-yellow-300" />
              <span>H-Maker 3D Studio</span>
            </div>
          </div>

          {/* BADGES DE RECURSOS INFANTIS */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-800 font-bold">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 border border-white/40 shadow-xs">
              <Smile className="w-4 h-4 text-indigo-600" />
              <span>Brinquedos Articulados 🦖</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 border border-white/40 shadow-xs">
              <Rocket className="w-4 h-4 text-sky-600" />
              <span>Chaveiros com Seu Nome 🔑</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 border border-white/40 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Orçamento no WhatsApp 💬</span>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: CARDS INFORMATIVOS DO HEITOR */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          <div className="p-4 rounded-2xl bg-white/15 border border-white/20 shadow-md backdrop-blur-md flex items-center justify-between hover:bg-white/20 transition-all">
            <div>
              <span className="text-[11px] font-bold text-sky-200 uppercase block tracking-wider">TESTADO E APROVADO</span>
              <span className="text-lg font-black text-white">Garantia do Heitor 🦖</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              ✨
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/15 border border-white/20 shadow-md backdrop-blur-md flex items-center justify-between hover:bg-white/20 transition-all">
            <div>
              <span className="text-[11px] font-bold text-sky-200 uppercase block tracking-wider">MATERIAIS ECOLÓGICOS</span>
              <span className="text-lg font-black text-yellow-300">PLA Atóxico & Seguro 🌱</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-yellow-300 font-bold text-lg">
              🌿
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/15 border border-white/20 shadow-md backdrop-blur-md flex items-center justify-between hover:bg-white/20 transition-all">
            <div>
              <span className="text-[11px] font-bold text-sky-200 uppercase block tracking-wider">FAÇA SEU PEDIDO</span>
              <span className="text-lg font-black text-white">Escolha Cores & Nomes 🎨</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              💬
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
