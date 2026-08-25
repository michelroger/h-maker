import React from 'react';
import type { Product } from '../types';
import { Box, Sparkles, MessageCircle, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MAIS VENDIDO! 🚀</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-sky-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1 shadow-xs">
          <Box className="w-3 h-3 text-sky-500" />
          <span>3D READY</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto">
            {product.availableMaterials.slice(0, 3).map((mat) => (
              <span
                key={mat}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              >
                {mat}
              </span>
            ))}
          </div>

          <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {product.availableColors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-slate-200 shadow-xs"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.availableColors.length > 4 && (
              <span className="text-[10px] font-bold text-slate-400 ml-1">
                +{product.availableColors.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              ~{product.printTimeHours}h
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">A PARTIR DE</span>
            <span className="text-xl font-black text-indigo-600">
              R$ {product.basePrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 group-hover:scale-105 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Pedir Orçamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
