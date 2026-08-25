import type { Product, QuoteCustomization, StoreSettings } from '../types';

export const generateWhatsAppLink = (
  product: Product,
  customization: QuoteCustomization,
  settings: StoreSettings
): string => {
  const scaledX = Math.round(product.dimensions.x * customization.scaleMultiplier);
  const scaledY = Math.round(product.dimensions.y * customization.scaleMultiplier);
  const scaledZ = Math.round(product.dimensions.z * customization.scaleMultiplier);

  const printModeLabel = customization.printMode === 'ams'
    ? 'Com AMS (Multicolor 🌈)'
    : 'Sem AMS (Cor Única 🧱)';

  const lines = [
    `🚀 *Olá H-Maker!* Gostaria de solicitar um orçamento para esta peça 3D:`,
    '',
    `📦 *PRODUTO:* ${product.title}`,
    `🎨 *MODO DE IMPRESSÃO:* ${printModeLabel}`,
    `🌱 *MATERIAL:* ${customization.material}`,
    `🌈 *COR SELECIONADA:* ${customization.color.name}`,
    `📏 *ESCALA:* ${(customization.scaleMultiplier * 100).toFixed(0)}% (${scaledX} × ${scaledY} × ${scaledZ} mm)`,
    `🧊 *PREENCHIMENTO (INFILL):* ${customization.infillPercent}%`,
    `🔢 *QUANTIDADE:* ${customization.quantity} unidade(s)`,
  ];

  if (customization.customNotes) {
    lines.push(`✏️ *NOME / OBSERVAÇÕES:* ${customization.customNotes}`);
  }

  lines.push(`💰 *VALOR ESTIMADO:* R$ ${customization.calculatedPrice.toFixed(2)}`);
  lines.push('');
  lines.push('Podemos confirmar a produção e o prazo de entrega? Obrigado!');

  const text = lines.join('\n');
  const encodedText = encodeURIComponent(text);
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};
