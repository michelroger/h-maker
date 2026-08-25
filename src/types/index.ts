export type ProductCategory = 
  | 'toys'
  | 'keychains'
  | 'school'
  | 'decor' 
  | 'games'
  | 'custom'
  | 'organizer' 
  | 'functional'
  | 'geek' 
  | 'cosplay' 
  | 'mechanical' 
  | 'tools';

export interface CustomMaterial {
  id: string;
  name: string; // Ex: PLA, PETG, ABS, TPU, Resina, PETG-CF, Nylon, ASA
  priceMultiplier: number; // Ex: 1.0, 1.15, 1.4
  description?: string;
}

export interface ProductColor {
  name: string;
  hex: string; // Hex ou 'gradient' para Multicolor / Rainbow / Todas as Cores
}

export interface ProductDimensions {
  x: number; // mm
  y: number; // mm
  z: number; // mm
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  basePrice: number; // Preço inicial de venda ao público em R$
  dimensions: ProductDimensions;
  weightGrams: number;
  printTimeHours: number;
  availableMaterials: string[]; // Lista de nomes de materiais (ex: ['PLA', 'PETG', 'Nylon'])
  availableColors: ProductColor[]; // Cores disponíveis para a peça
  supportsAMS?: boolean; // Se a peça suporta impressão multicolorida via AMS (Bambu Lab)
  stlUrl?: string; // URL web ou Data URL base64 do modelo 3D (.stl / .3mf)
  imageUrl: string; // Imagem/capa principal
  images?: string[]; // Galeria de fotos adicionais da peça
  featured?: boolean;
  inStock: boolean;
  tags: string[];
}

export interface QuoteCustomization {
  productId: string;
  material: string;
  color: ProductColor;
  printMode: 'ams' | 'standard'; // 'ams' = Com AMS (Multicolor), 'standard' = Sem AMS (Cor Única)
  scaleMultiplier: number; // Ex: 1 = 100%, 1.5 = 150%
  infillPercent: number; // Ex: 15%, 20%, 50%, 100%
  quantity: number;
  customNotes: string;
  calculatedPrice: number;
}

export interface CostCalculationParams {
  filamentWeightGrams: number;
  filamentCostPerKg: number;
  printTimeHours: number;
  printTimeMinutes: number;
  powerWatts: number;
  kwhCost: number;
  depreciationCostPerHour: number;
  failureRiskRatePercent: number;
  postProcessingLaborCost: number;
  desiredProfitMarginPercent: number;
}

export interface CostCalculationResult {
  filamentCost: number;
  electricityCost: number;
  depreciationCost: number;
  riskBufferCost: number;
  laborCost: number;
  totalProductionCost: number;
  profitAmount: number;
  suggestedPrice: number;
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  customMessageTemplate: string;
  adminPinHash: string;
  adminSalt: string;
  currencySymbol: string;
  customMaterials: CustomMaterial[];
  globalColors?: ProductColor[]; // Paleta global de cores cadastradas na loja
  instagramHandle?: string;
  instagramUrl?: string;
  githubRepo?: string;
  githubToken?: string;
}
