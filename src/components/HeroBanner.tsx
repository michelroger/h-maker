import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Rocket, Smile, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface ShowcaseSlide {
  id: string;
  image: string;
  title: string;
  category: string;
  price: string;
}

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: '1',
    image: './hmaker-dragon.jpg',
    title: 'Dragão Arco-Íris Articulado 3D',
    category: 'Brinquedo Articulado 🐉',
    price: 'R$ 65,00',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    title: 'T-Rex Flexível 3D',
    category: 'Dinossauro 🦖',
    price: 'R$ 55,00',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    title: 'Chaveiro Personalizado com Nome',
    category: 'Escolar 🔑',
    price: 'R$ 18,00',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    title: 'Suporte Robô Gamer 3D',
    category: 'Games 🎮',
    price: 'R$ 48,00',
  },
];

export const HeroBanner: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Auto-rotação suave a cada 4.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? SHOWCASE_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const activeSlide = SHOWCASE_SLIDES[activeSlideIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-indigo-100/50 p-6 sm:p-8 lg:p-10 mb-8">
      {/* Luzes decorativas sutis de fundo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LADO ESQUERDO: HISTÓRIA DO HEITOR PIRES */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>CONHEÇA O PEQUENO MAKER • HEITOR PIRES (7 ANOS)</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Oi! Eu sou o Heitor! 🚀
            </h1>
            <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mt-1">
              Criando e descobrindo tudo o que podemos fazer com a Impressão 3D!
            </p>
          </div>

          {/* CARD DA MENSAGEM DO HEITOR */}
          <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 text-slate-700 text-sm sm:text-base font-medium leading-relaxed space-y-3 shadow-inner">
            <p>
              Recentemente ganhei uma impressora 3D! Desde então, estou amando criar, experimentar e descobrir todas as coisas legais que podemos fazer com ela.
            </p>
            <p>
              Aqui no site, você encontra modelos 3D testados e aprovados por mim, feitos para brincar, presentear, organizar e aprender. Espero que minhas criações tragam um pouquinho de diversão para o seu dia!
            </p>
            <p className="font-bold text-slate-900 pt-1 border-t border-slate-200/70">
              Obrigado por apoiar o meu trabalho e o meu pequeno negócio!
            </p>
          </div>

          {/* ASSINATURA E BADGES DE RECURSOS EM LINHA HARMONIOSA */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-200">
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300 animate-pulse" />
              <span>Com carinho, Heitor Pires</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
              <Smile className="w-4 h-4 text-indigo-600" />
              <span>Articulados 🦖</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
              <Rocket className="w-4 h-4 text-sky-600" />
              <span>Com Nome 🔑</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp 💬</span>
            </div>
          </div>

        </div>

        {/* LADO DIREITO: SHOWCASE MODERNO & CONECTADO */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-2xl group transition-all">
            
            {/* CABEÇALHO DO CARROSEL INTERATIVO */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">VITRINE 3D EM DESTAQUE</span>
              </div>

              {/* Botões de Navegação */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
                  title="Próximo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ÁREA DA IMAGEM PRINCIPAL COM TRANSIÇÃO */}
            <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden">
              <img
                key={activeSlide.id}
                src={activeSlide.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80';
                }}
                alt={activeSlide.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

              {/* LEGENDA FLUTUANTE DA PEÇA */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl text-slate-800 shadow-xl border border-white/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider">
                    {activeSlide.category}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                    {activeSlide.title}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-xs font-black shadow-xs">
                  {activeSlide.price}
                </span>
              </div>
            </div>

            {/* SELETOR DE MINIATURAS (THUMBNAILS) CONECTADO */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
              {SHOWCASE_SLIDES.map((s, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`relative flex-1 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      isActive
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                        : 'border-slate-800 opacity-50 hover:opacity-100'
                    }`}
                    title={s.title}
                  >
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
