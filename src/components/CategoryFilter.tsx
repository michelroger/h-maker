import React from 'react';
import type { CustomMaterial } from '../types';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedMaterial: string;
  onSelectMaterial: (material: string) => void;
  materials: CustomMaterial[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'title';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'title') => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'Tudo', icon: '🌟' },
  { id: 'toys', label: 'Brinquedos & Articulados', icon: '🧸' },
  { id: 'keychains', label: 'Chaveiros & Nome', icon: '🔑' },
  { id: 'school', label: 'Escolar & Lápis', icon: '✏️' },
  { id: 'games', label: 'Games & Geek', icon: '🎮' },
  { id: 'decor', label: 'Decoração & Quarto', icon: '🌈' },
  { id: 'custom', label: 'Peças Sob Medida', icon: '🔧' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedMaterial,
  onSelectMaterial,
  materials = [],
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* BOTÕES DE CATEGORIAS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.03]'
                  : 'bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* BARRA DE FILTROS ADICIONAIS & ORDENAÇÃO */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            Material:
          </span>

          <button
            onClick={() => onSelectMaterial('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedMaterial === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>

          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => onSelectMaterial(mat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMaterial === mat.name
                  ? 'bg-sky-100 text-sky-700 border border-sky-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {mat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
          >
            <option value="featured">Mais Divertidos 🌟</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="title">Nome (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
