import React, { useState } from 'react';
import type { Product, StoreSettings, ProductCategory, CustomMaterial, ProductColor } from '../types';
import { hashPassword } from '../services/security';
import { APP_VERSION, APP_BUILD_DATE, CHANGELOG } from '../config/version';
import { X, ShieldLock, Plus, Trash2, Edit3, Save, Download, Upload, Lock, Phone, Store, Key, GitCommit, CheckCircle2, History, Calculator, Layers, FileCode, UploadCloud, Image as ImageIcon, Palette, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  onOpenCostCalc: () => void;
}

const DEFAULT_GLOBAL_COLORS: ProductColor[] = [
  { name: 'Todas as Cores / Multicolor (AMS)', hex: 'gradient' },
  { name: 'Preto Stealth', hex: '#121212' },
  { name: 'Branco Neve', hex: '#F8FAFC' },
  { name: 'Laranja Neon', hex: '#FF5500' },
  { name: 'Ciano Elétrico', hex: '#00F0FF' },
  { name: 'Vermelho Fogo', hex: '#EF4444' },
  { name: 'Verde Esmeralda', hex: '#10B981' },
  { name: 'Dourado Silk', hex: '#D97706' },
  { name: 'Cinza Titânio', hex: '#4A5568' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  settings,
  onSaveSettings,
  onOpenCostCalc,
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'products' | 'materials' | 'settings' | 'sync' | 'changelog'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Estados de Configurações da Loja
  const [whatsappNumber, setWhatsappNumber] = useState<string>(settings.whatsappNumber);
  const [storeName, setStoreName] = useState<string>(settings.storeName);
  const [newPin, setNewPin] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Estados de Materiais Dinâmicos
  const [materialsList, setMaterialsList] = useState<CustomMaterial[]>(
    settings.customMaterials || [
      { id: 'pla', name: 'PLA', priceMultiplier: 1.0 },
      { id: 'petg', name: 'PETG', priceMultiplier: 1.15 },
      { id: 'abs', name: 'ABS', priceMultiplier: 1.1 },
      { id: 'tpu', name: 'TPU', priceMultiplier: 1.3 },
      { id: 'resina', name: 'Resina', priceMultiplier: 1.4 },
    ]
  );
  const [newMaterialName, setNewMaterialName] = useState<string>('');
  const [newMaterialMultiplier, setNewMaterialMultiplier] = useState<number>(1.0);

  // Estados da Paleta Global de Cores
  const [globalColorsList, setGlobalColorsList] = useState<ProductColor[]>(
    settings.globalColors || DEFAULT_GLOBAL_COLORS
  );
  const [newColorName, setNewColorName] = useState<string>('');
  const [newColorHex, setNewColorHex] = useState<string>('#FF5500');

  // Autenticação Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    const inputHash = await hashPassword(pinInput, settings.adminSalt);
    if (inputHash === settings.adminPinHash || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinInput('');
    } else {
      setPinError('PIN ou Senha incorreta. Tente novamente.');
    }
  };

  // Upload Local de Arquivo 3D (.stl / .3mf)
  const handleStlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingProduct) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingProduct({
            ...editingProduct,
            stlUrl: event.target.result as string,
          });
          alert(`Modelo 3D (${file.name}) carregado com sucesso!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de Múltiplas Fotos
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && editingProduct) {
      const filesArray = Array.from(e.target.files);
      const currentImages = editingProduct.images || (editingProduct.imageUrl ? [editingProduct.imageUrl] : []);
      const newImagesList: string[] = [...currentImages];

      let loadedCount = 0;
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImagesList.push(event.target.result as string);
            loadedCount++;
            if (loadedCount === filesArray.length) {
              setEditingProduct({
                ...editingProduct,
                imageUrl: editingProduct.imageUrl || newImagesList[0],
                images: newImagesList,
              });
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remover Imagem da Galeria
  const handleRemoveImageFromGallery = (indexToRemove: number) => {
    if (!editingProduct || !editingProduct.images) return;
    const updatedImages = editingProduct.images.filter((_, idx) => idx !== indexToRemove);
    setEditingProduct({
      ...editingProduct,
      imageUrl: updatedImages[0] || editingProduct.imageUrl,
      images: updatedImages,
    });
  };

  // Alternar Seleção de Cor para o Produto
  const handleToggleProductColor = (colorObj: ProductColor) => {
    if (!editingProduct) return;
    const currentColors = editingProduct.availableColors || [];
    const exists = currentColors.some((c) => c.hex.toLowerCase() === colorObj.hex.toLowerCase());

    let updatedColors: ProductColor[];
    if (exists) {
      updatedColors = currentColors.filter((c) => c.hex.toLowerCase() !== colorObj.hex.toLowerCase());
    } else {
      updatedColors = [...currentColors, colorObj];
    }

    setEditingProduct({
      ...editingProduct,
      availableColors: updatedColors,
    });
  };

  // Salvar Peça (Criar ou Editar)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) return;

    const finalImages = editingProduct.images || (editingProduct.imageUrl ? [editingProduct.imageUrl] : []);
    const finalColors = editingProduct.availableColors && editingProduct.availableColors.length > 0
      ? editingProduct.availableColors
      : globalColorsList.slice(0, 3);

    if (editingProduct.id) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? ({ ...p, ...editingProduct, images: finalImages, availableColors: finalColors } as Product)
          : p
      );
      onSaveProducts(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: editingProduct.title || 'Nova Peça 3D',
        description: editingProduct.description || '',
        category: editingProduct.category || 'functional',
        basePrice: editingProduct.basePrice || 50.0,
        dimensions: editingProduct.dimensions || { x: 100, y: 100, z: 100 },
        weightGrams: editingProduct.weightGrams || 100,
        printTimeHours: editingProduct.printTimeHours || 4,
        availableMaterials: editingProduct.availableMaterials || materialsList.map((m) => m.name),
        availableColors: finalColors,
        supportsAMS: editingProduct.supportsAMS !== false,
        stlUrl: editingProduct.stlUrl || '',
        imageUrl: editingProduct.imageUrl || finalImages[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        images: finalImages,
        featured: editingProduct.featured || false,
        inStock: editingProduct.inStock !== false,
        tags: editingProduct.tags || ['3D', 'Print'],
      };
      onSaveProducts([newProd, ...products]);
    }

    setEditingProduct(null);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  // Excluir Peça
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta peça do catálogo?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };

  // Adicionar Material
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialName.trim()) return;

    const newMat: CustomMaterial = {
      id: `mat-${Date.now()}`,
      name: newMaterialName.trim(),
      priceMultiplier: newMaterialMultiplier,
    };

    const updated = [...materialsList, newMat];
    setMaterialsList(updated);
    onSaveSettings({ ...settings, customMaterials: updated, globalColors: globalColorsList });
    setNewMaterialName('');
    setNewMaterialMultiplier(1.0);
    confetti({ particleCount: 30, spread: 50 });
  };

  // Excluir Material
  const handleDeleteMaterial = (id: string) => {
    const updated = materialsList.filter((m) => m.id !== id);
    setMaterialsList(updated);
    onSaveSettings({ ...settings, customMaterials: updated, globalColors: globalColorsList });
  };

  // Adicionar Cor Global
  const handleAddGlobalColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;

    const newColor: ProductColor = {
      name: newColorName.trim(),
      hex: newColorHex,
    };

    const updated = [...globalColorsList, newColor];
    setGlobalColorsList(updated);
    onSaveSettings({ ...settings, customMaterials: materialsList, globalColors: updated });
    setNewColorName('');
    setNewColorHex('#FF5500');
    confetti({ particleCount: 30, spread: 50 });
  };

  // Excluir Cor Global
  const handleDeleteGlobalColor = (colorHex: string) => {
    const updated = globalColorsList.filter((c) => c.hex.toLowerCase() !== colorHex.toLowerCase());
    setGlobalColorsList(updated);
    onSaveSettings({ ...settings, customMaterials: materialsList, globalColors: updated });
  };

  // Salvar Configurações Gerais
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedHash = settings.adminPinHash;

    if (newPin && newPin.length >= 4) {
      updatedHash = await hashPassword(newPin, settings.adminSalt);
    }

    const updatedSettings: StoreSettings = {
      ...settings,
      whatsappNumber,
      storeName,
      adminPinHash: updatedHash,
      customMaterials: materialsList,
      globalColors: globalColorsList,
    };

    onSaveSettings(updatedSettings);
    setSaveMessage('Configurações salvas com sucesso!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Exportar Catálogo JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Backup JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onSaveProducts(parsed);
            alert('Catálogo importado com sucesso!');
          }
        } catch (err) {
          alert('Arquivo JSON inválido.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* HEADER DO ADMIN */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldLock className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white">Painel Administrativo H-Maker 3D</h2>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={onOpenCostCalc}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all"
                title="Abrir Calculadora de Custos 3D"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculadora de Custos 3D</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Acesso Restrito ao Maker</h3>
              <p className="text-xs text-slate-400 mt-1">
                Digite o PIN ou senha de administrador (PIN padrão: <code className="text-orange-400 font-mono">1234</code>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full bg-slate-950 text-white text-center text-base rounded-xl px-4 py-3 border border-slate-800 focus:border-orange-500 focus:outline-none tracking-widest font-mono"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-400">{pinError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-all"
              >
                Entrar no Painel Admin
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TABS DE NAVEGAÇÃO DO ADMIN */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Catálogo ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Materiais & Cores ({materialsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Configurações da Loja
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'sync'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Exportar / GitHub Sync
              </button>

              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'changelog'
                    ? 'border-cyan-500 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Versões & CI/CD</span>
              </button>
            </div>

            {/* CONTEÚDO DAS TABS */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: PRODUTOS & SUPORTE AMS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white font-mono">GERENCIAMENTO DE PEÇAS 3D</h3>
                    <button
                      onClick={() =>
                        setEditingProduct({
                          title: '',
                          description: '',
                          category: 'functional',
                          basePrice: 50,
                          dimensions: { x: 100, y: 100, z: 100 },
                          weightGrams: 100,
                          printTimeHours: 4,
                          availableMaterials: materialsList.map((m) => m.name),
                          availableColors: globalColorsList.slice(0, 4),
                          supportsAMS: true,
                          stlUrl: '',
                          imageUrl: '',
                          images: [],
                          inStock: true,
                        })
                      }
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Peça 3D</span>
                    </button>
                  </div>

                  {/* FORMULÁRIO DE EDIÇÃO */}
                  {editingProduct && (
                    <form onSubmit={handleSaveProduct} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-orange-400 font-mono">
                        {editingProduct.id ? 'EDITAR PEÇA 3D' : 'CADASTRAR NOVA PEÇA 3D'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Título do Produto:</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.title || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Categoria:</label>
                          <select
                            value={editingProduct.category || 'functional'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          >
                            <option value="toys">Brinquedos & Articulados 🧸</option>
                            <option value="keychains">Chaveiros & Nome 🔑</option>
                            <option value="school">Escolar & Lápis ✏️</option>
                            <option value="games">Games & Geek 🎮</option>
                            <option value="decor">Decoração & Quarto 🌈</option>
                            <option value="custom">Peças Sob Medida 🔧</option>
                            <option value="organizer">Organizadores 📦</option>
                            <option value="functional">Peças Úteis 🛠️</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Preço Base Inicial (R$):</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={editingProduct.basePrice || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">URL da Imagem Capa Principal:</label>
                          <input
                            type="text"
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => {
                              const newUrl = e.target.value;
                              const currentImages = editingProduct.images || [];
                              setEditingProduct({
                                ...editingProduct,
                                imageUrl: newUrl,
                                images: newUrl && !currentImages.includes(newUrl) ? [newUrl, ...currentImages] : currentImages,
                              });
                            }}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>

                        {/* FLAG DE SUPORTE AMS (MULTICOLOR) */}
                        <div className="sm:col-span-2 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-pink-400" />
                            <div>
                              <span className="font-mono font-bold text-white block text-xs">Suporta Impressão Multicolorida (AMS / Bambu Lab)?</span>
                              <span className="text-[10px] text-slate-400">Permite ao cliente escolher entre impressão Com AMS (Multicolor) ou Sem AMS (Cor Única).</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={editingProduct.supportsAMS !== false}
                            onChange={(e) => setEditingProduct({ ...editingProduct, supportsAMS: e.target.checked })}
                            className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                          />
                        </div>

                        {/* SELETOR INTERATIVO DE CORES DISPONÍVEIS PARA A PEÇA */}
                        <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <label className="block text-xs font-mono font-bold text-orange-400 flex items-center gap-1.5">
                            <Palette className="w-4 h-4" />
                            Cores Disponíveis para esta Peça (Selecione na Paleta da Loja):
                          </label>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {globalColorsList.map((col, idx) => {
                              const selectedColors = editingProduct.availableColors || [];
                              const isChecked = selectedColors.some((c) => c.hex.toLowerCase() === col.hex.toLowerCase());
                              const isRainbow = col.hex === 'gradient' || col.hex.includes('gradient');

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleToggleProductColor(col)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                                    isChecked
                                      ? 'bg-orange-500/20 text-white border-orange-500 shadow'
                                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  <span
                                    className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-inner flex items-center justify-center"
                                    style={{
                                      background: isRainbow
                                        ? 'linear-gradient(135deg, #ef4444, #f59e0b, #10b981, #06b6d4, #8b5cf6)'
                                        : col.hex,
                                    }}
                                  >
                                    {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                                  </span>
                                  <span>{col.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* GALERIA DE FOTOS */}
                        <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4" />
                              Galeria de Fotos da Peça (Várias Imagens)
                            </label>

                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 cursor-pointer font-bold text-xs transition-all">
                              <UploadCloud className="w-4 h-4" />
                              <span>+ Adicionar Várias Fotos</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleMultipleImagesUpload}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {editingProduct.images && editingProduct.images.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {editingProduct.images.map((img, idx) => (
                                <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImageFromGallery(idx)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:bg-rose-700 transition-all shadow"
                                    title="Remover foto"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic">Nenhuma foto adicional adicionada.</p>
                          )}
                        </div>

                        {/* UPLOAD DO MODELO 3D (.STL / .3MF) */}
                        <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <label className="block text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                            <FileCode className="w-4 h-4" />
                            Modelo 3D para Visualização do Cliente (.stl / .3mf)
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="text-[11px] text-slate-400 block mb-1">Option A: Cole uma URL direta do arquivo STL:</span>
                              <input
                                type="text"
                                value={editingProduct.stlUrl || ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, stlUrl: e.target.value })}
                                className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none font-mono"
                                placeholder="https://raw.githubusercontent.com/.../model.stl"
                              />
                            </div>

                            <div>
                              <span className="text-[11px] text-slate-400 block mb-1">Option B: Upload de Arquivo STL do Computador:</span>
                              <label className="flex items-center justify-center gap-2 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer font-bold text-xs transition-all">
                                <UploadCloud className="w-4 h-4" />
                                <span>Selecionar Arquivo .STL / .3MF</span>
                                <input
                                  type="file"
                                  accept=".stl,.3mf"
                                  onChange={handleStlFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {editingProduct.stlUrl && (
                            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                              ✓ Modelo 3D carregado ({editingProduct.stlUrl.slice(0, 45)}...)
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 mb-1">Descrição Detalhada:</label>
                          <textarea
                            rows={2}
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Peça</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* LISTA DE PRODUTOS */}
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              {p.title}
                              {p.supportsAMS !== false && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/30">
                                  AMS READY
                                </span>
                              )}
                              {p.images && p.images.length > 1 && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30">
                                  {p.images.length} FOTOS
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Cat: {p.category} • Preço: R$ {p.basePrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 2: GERENCIAMENTO DE MATERIAIS & CORES */}
              {activeTab === 'materials' && (
                <div className="space-y-6 text-xs text-slate-300">
                  <h3 className="text-sm font-bold text-white font-mono">GERENCIAMENTO DINÂMICO DE MATERIAIS & PALETA DE CORES</h3>

                  <form onSubmit={handleAddMaterial} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-orange-400 font-mono">CADASTRAR NOVO FILAMENTO / MATERIAL</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Nome do Material:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: PETG-CF, Nylon, ASA..."
                          value={newMaterialName}
                          onChange={(e) => setNewMaterialName(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Multiplicador de Preço:</label>
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={newMaterialMultiplier}
                          onChange={(e) => setNewMaterialMultiplier(parseFloat(e.target.value) || 1.0)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Material</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {materialsList.map((mat) => (
                      <div key={mat.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white font-mono text-sm block">{mat.name}</span>
                          <span className="text-[11px] text-slate-400">Multiplicador: {mat.priceMultiplier}x</span>
                        </div>

                        <button
                          onClick={() => handleDeleteMaterial(mat.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          title="Excluir Material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddGlobalColor} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 pt-6 border-t border-slate-800/80">
                    <h4 className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                      <Palette className="w-4 h-4" />
                      GERENCIADOR DA PALETA GLOBAL DE CORES DA LOJA
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Nome da Cor:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Roxo Galaxy, Amarelo Sun..."
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Código Hex da Cor:</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
                          />
                          <input
                            type="text"
                            required
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="flex-1 bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono uppercase focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Cor à Paleta</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {globalColorsList.map((col, idx) => {
                      const isRainbow = col.hex === 'gradient' || col.hex.includes('gradient');
                      return (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full border border-slate-700 shadow-inner"
                              style={{
                                background: isRainbow
                                  ? 'linear-gradient(135deg, #ef4444, #f59e0b, #10b981, #06b6d4, #8b5cf6)'
                                  : col.hex,
                              }}
                            />
                            <span className="font-bold text-white text-xs truncate max-w-[80px]">{col.name}</span>
                          </div>

                          <button
                            onClick={() => handleDeleteGlobalColor(col.hex)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Excluir Cor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* TAB 3: CONFIGURAÇÕES DA LOJA */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveStoreSettings} className="max-w-md space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-white font-mono mb-4">CONFIGURAÇÕES GERAIS DA LOJA</h3>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Número do WhatsApp para Orçamentos (com DDD e Código do País):
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="5511999999999"
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-orange-400" />
                      Nome Comercial da Marca / Maker:
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      Alterar PIN / Senha do Admin (Mínimo 4 digitos):
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Deixe em branco se não quiser alterar..."
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {saveMessage && <p className="text-emerald-400 text-xs font-semibold">{saveMessage}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Salvar Configurações
                  </button>
                </form>
              )}

              {/* TAB 4: SINCRONIZAÇÃO E GITHUB */}
              {activeTab === 'sync' && (
                <div className="space-y-6 text-xs text-slate-300">
                  <h3 className="text-sm font-bold text-white font-mono">EXPORTAR & DEPLOY NO GITHUB PAGES</h3>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-orange-400 flex items-center gap-1.5">
                      <Download className="w-4 h-4" />
                      1. Exportar Catálogo JSON (`catalog.json`)
                    </h4>
                    <p className="text-slate-400">
                      Baixe o arquivo de catálogo atualizado com todas as alterações para substituir na pasta <code className="text-cyan-400">src/data/catalog.json</code> antes de dar git commit.
                    </p>
                    <button
                      onClick={handleExportJSON}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold flex items-center gap-2 hover:bg-slate-800"
                    >
                      <Download className="w-4 h-4 text-orange-400" />
                      <span>Baixar `catalog.json`</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      2. Importar Backup JSON
                    </h4>
                    <p className="text-slate-400">
                      Restaure ou carregue um catálogo salvo anteriormente.
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: CONTROLE DE VERSÃO */}
              {activeTab === 'changelog' && (
                <div className="space-y-6 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">CONTROLE DE VERSÃO & AUTOMATION CI/CD</h3>
                      <p className="text-[11px] text-slate-400">Status atual da versão e esteira de publicação automática</p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold">
                      v{APP_VERSION} ({APP_BUILD_DATE})
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Pipeline de Publicação Automática (CI/CD GitHub Actions)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ATIVO
                      </span>
                    </div>

                    <p className="text-slate-400 leading-relaxed">
                      O arquivo <code className="text-cyan-400">.github/workflows/deploy.yml</code> está ativo. A cada commit realizado na branch <code className="text-orange-400">main</code>, o GitHub compila e publica o site automaticamente no GitHub Pages!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <GitCommit className="w-4 h-4 text-orange-400" />
                      Histórico de Versões e Melhorias
                    </h4>

                    {CHANGELOG.map((item) => (
                      <div key={item.version} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-orange-400 font-bold text-sm">v{item.version} • {item.title}</span>
                          <span className="text-slate-500 text-[10px]">{item.date}</span>
                        </div>

                        <ul className="space-y-1.5 pt-1 text-slate-300">
                          {item.changes.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 font-mono">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
