import React, { useState } from 'react';
import type { Product, ProductColor, StoreSettings } from '../types';
import { ThreeDViewer } from './ThreeDViewer';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { X, MessageSquare, CheckCircle2, Box, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  settings: StoreSettings;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, settings }) => {
  if (!product) return null;

  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'3d' | 'gallery'>('gallery');

  // Opção AMS vs Sem AMS
  const [printMode, setPrintMode] = useState<'ams' | 'standard'>('standard');

  const defaultMaterial = product.availableMaterials[0] || settings.customMaterials[0]?.name || 'PLA Ecológico';
  const [selectedMaterialName, setSelectedMaterialName] = useState<string>(defaultMaterial);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.availableColors[0] || { name: 'Arco-Íris Silk', hex: 'gradient' }
  );
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);
  const [infillPercent, setInfillPercent] = useState<number>(20);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');

  const currentMaterialObj = settings.customMaterials.find(
    (m) => m.name.toLowerCase() === selectedMaterialName.toLowerCase()
  );
  const materialMultiplier = currentMaterialObj ? currentMaterialObj.priceMultiplier : 1.0;

  // AMS adiciona um fator de purga/tempo de 1.15
  const amsFactor = printMode === 'ams' ? 1.15 : 1.0;
  const scaleFactor = Math.pow(scaleMultiplier, 2.2);
  const infillFactor = 1 + (infillPercent - 20) * 0.005;

  const calculatedPrice = Number(
    (product.basePrice * materialMultiplier * amsFactor * scaleFactor * infillFactor * quantity).toFixed(2)
  );

  const scaledX = Math.round(product.dimensions.x * scaleMultiplier);
  const scaledY = Math.round(product.dimensions.y * scaleMultiplier);
  const scaledZ = Math.round(product.dimensions.z * scaleMultiplier);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleWhatsAppQuote = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
    });

    const url = generateWhatsAppLink(
      product,
      {
        productId: product.id,
        material: selectedMaterialName,
        color: selectedColor,
        printMode,
        scaleMultiplier,
        infillPercent,
        quantity,
        customNotes,
        calculatedPrice,
      },
      settings
    );

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* HEADER DO MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-black text-slate-900 line-clamp-1">{product.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LADO ESQUERDO: GALERIA / VISUALIZADOR 3D */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="relative w-full h-[360px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between group">
              
              {viewMode === '3d' ? (
                <ThreeDViewer
                  stlUrl={product.stlUrl}
                  colorHex={selectedColor.hex === 'gradient' ? '#4F46E5' : selectedColor.hex}
                  scale={scaleMultiplier}
                />
              ) : (
                <div className="relative w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={allImages[activeImageIndex]}
                    alt={`${product.title} - foto ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-md transition-all"
                        title="Foto Anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-md transition-all"
                        title="Próxima Foto"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="absolute bottom-3 left-3 z-10">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === '3d' ? 'gallery' : '3d')}
                  className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  {viewMode === '3d' ? (
                    <>
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>📸 Ver Galeria ({allImages.length})</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-4 h-4 text-sky-500 animate-bounce" />
                      <span>🧊 Interagir no 3D</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {viewMode === 'gallery' && allImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {allImages.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        isActive
                          ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105 shadow-xs'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span>Dimensões Finais:</span>
                <span className="text-indigo-600 font-mono">{scaledX} × {scaledY} × {scaledZ} mm</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Peso Estimado:</span>
                <span className="font-mono">~{Math.round(product.weightGrams * scaleFactor)}g</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Impressão:</span>
                <span className={printMode === 'ams' ? 'text-purple-600 font-bold' : 'text-slate-700 font-bold'}>
                  {printMode === 'ams' ? '🌈 Com AMS (Multicolor)' : '🧱 Cor Única'}
                </span>
              </div>
            </div>

          </div>

          {/* LADO DIREITO: OPÇÕES E PERSONALIZAÇÃO */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* SELETOR DE MODO AMS */}
            {product.supportsAMS !== false && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  1. Estilo de Cores:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrintMode('standard')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      printMode === 'standard'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">🧱 Cor Única</span>
                    <span className="text-[10px] opacity-90 font-normal">Uma cor de sua escolha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintMode('ams')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      printMode === 'ams'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-md shadow-purple-200 scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      Multicolor (AMS)
                    </span>
                    <span className="text-[10px] opacity-90 font-normal">Mais de uma cor na peça</span>
                  </button>
                </div>
              </div>
            )}

            {/* SELETOR DE MATERIAIS */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                2. Material do Filamento:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.availableMaterials.map((matName) => {
                  const isSelected = selectedMaterialName.toLowerCase() === matName.toLowerCase();
                  return (
                    <button
                      key={matName}
                      type="button"
                      onClick={() => setSelectedMaterialName(matName)}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all text-center border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {matName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELETOR DE CORES */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                3. Cor Principal: <span className="text-slate-800 font-bold">{selectedColor.name}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {product.availableColors.map((col, idx) => {
                  const isSelected = selectedColor.name === col.name;
                  const isRainbow = col.hex === 'gradient' || col.hex.includes('gradient');

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 scale-110 shadow-md shadow-indigo-100'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{
                        background: isRainbow
                          ? 'linear-gradient(135deg, #ef4444, #f59e0b, #10b981, #06b6d4, #8b5cf6)'
                          : col.hex,
                      }}
                      title={col.name}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ESCALA DE TAMANHO */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  4. Tamanho Desejado:
                </label>
                <span className="text-xs font-bold text-indigo-600 font-mono">
                  {(scaleMultiplier * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>50% (Mini)</span>
                <span>100% (Padrão)</span>
                <span>200% (Grande)</span>
              </div>
            </div>

            {/* PREENCHIMENTO INFILL */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                5. Preenchimento Interno (Infill):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 25, 50, 100].map((inf) => (
                  <button
                    key={inf}
                    type="button"
                    onClick={() => setInfillPercent(inf)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      infillPercent === inf
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {inf}% {inf === 100 ? '(Sólido)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* OBSERVAÇÃO / NOME PERSONALIZADO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantidade:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 text-slate-800 text-sm rounded-2xl p-2.5 border border-slate-200 text-center font-mono font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome ou Detalhes do Pedido:</label>
                <input
                  type="text"
                  placeholder="Ex: Nome para o chaveiro ou combinação de cores..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-2xl p-2.5 border border-slate-200 focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* VALOR ESTIMADO E BOTÃO DO WHATSAPP */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">VALOR TOTAL ESTIMADO</span>
                <span className="text-2xl font-black text-emerald-600">
                  R$ {calculatedPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transform hover:scale-105 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Pedir no WhatsApp 💬</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
