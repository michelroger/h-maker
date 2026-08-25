import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Rocket, Smile, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  image: string;
  title: string;
  tag: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    image: './hmaker-dragon.jpg',
    title: 'Dragão Arco-Íris Articulado 3D',
    tag: 'Brinquedo 3D 🐉',
  },
  {
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    title: 'T-Rex Flexível Articulado',
    tag: 'Dinossauro 🦖',
  },
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    title: 'Chaveiro 3D com Seu Nome',
    tag: 'Personalizado 🔑',
  },
  {
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    title: 'Suporte Robô Gamer 3D',
    tag: 'Games & Desk 🎮',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto-rotação do carrossel a cada 4.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const slide = CAROUSEL_SLIDES[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 text-white p-6 sm:p-10 mb-8 shadow-xl shadow-indigo-100">
      {/* Círculos decorativos luminosos de fundo */}
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LADO ESQUERDO: MENSAGEM ORGANIZADA DO HEITOR PIRES */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>CONHEÇA O PEQUENO MAKER • HEITOR PIRES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
            Oi! Eu sou o Heitor! 🚀
          </h1>

          <div className="space-y-3 text-sky-50 text-sm sm:text-base font-medium leading-relaxed drop-shadow-xs max-w-xl">
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

          {/* RODAPÉ ORGANIZADO DO TEXTO: ASSINATURA E BADGES EM LINHA */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-slate-800 font-black text-sm shadow-md">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
              <span>Com carinho, <span className="text-indigo-600">Heitor Pires</span></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 text-slate-800 text-xs font-bold shadow-xs">
              <Smile className="w-4 h-4 text-indigo-600" />
              <span>Articulados 🦖</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 text-slate-800 text-xs font-bold shadow-xs">
              <Rocket className="w-4 h-4 text-sky-600" />
              <span>Com Nome 🔑</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 text-slate-800 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp 💬</span>
            </div>
          </div>

        </div>

        {/* LADO DIREITO: CARROSSEL DE IMAGENS 3D */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl group transition-all duration-300">
            
            {/* CONTAINER DA IMAGEM DO CARROSSEL */}
            <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden">
              <img
                key={currentSlide}
                src={slide.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80';
                }}
                alt={slide.title}
                className="w-full h-full object-cover animate-fadeIn transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Botões de Navegação (Anterior / Próximo) */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-80 group-hover:opacity-100"
                title="Imagem Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-80 group-hover:opacity-100"
                title="Próxima Imagem"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Legenda do Slide */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/60 text-slate-800 text-xs font-bold flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-1.5 line-clamp-1">
                  <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="truncate">{slide.title}</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-mono flex-shrink-0">
                  {slide.tag}
                </span>
              </div>
            </div>

            {/* PONTOS INDICADORES DE SLIDE DO CARROSSEL */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
