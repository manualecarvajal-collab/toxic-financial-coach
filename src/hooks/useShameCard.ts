import { useCallback, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

export function useShameCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCard = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    setIsExporting(true);
    setExportError(null);

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#050505',
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      return blob;
    } catch (err) {
      setExportError('No se pudo generar la tarjeta de la vergüenza');
      console.error(err);
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadCard = useCallback(async (filename = 'financial-shame.png') => {
    const blob = await exportCard();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [exportCard]);

  const shareCard = useCallback(async () => {
    const blob = await exportCard();
    if (!blob) return;

    if (navigator.share && navigator.canShare({ files: [new File([blob], 'shame.png', { type: 'image/png' })] })) {
      try {
        await navigator.share({
          title: 'Mi Tarjeta de la Vergüenza Financiera',
          text: 'Mira cuánto dinero he tirado esta semana 💸',
          files: [new File([blob], 'financial-shame.png', { type: 'image/png' })]
        });
      } catch (err) {
        // Usuario canceló el share
        console.log('Share cancelled');
      }
    } else {
      // Fallback: descargar
      await downloadCard();
    }
  }, [exportCard, downloadCard]);

  return {
    cardRef,
    isExporting,
    exportError,
    exportCard,
    downloadCard,
    shareCard
  };
}