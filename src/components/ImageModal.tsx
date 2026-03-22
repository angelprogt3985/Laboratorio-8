import type React from 'react';
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropiedadesImageModal {
  imagenes: string[];
  indiceActual: number;
  prefijo?: string;
  alCerrar: () => void;
  alNavegar: (indice: number) => void;
}

export function ImageModal({
  imagenes,
  indiceActual,
  prefijo = 'Propiedad',
  alCerrar,
  alNavegar,
}: PropiedadesImageModal): React.ReactElement {
  const total = imagenes.length;
  const esElPrimero = indiceActual === 0;
  const esElUltimo = indiceActual === total - 1;

  function irAnterior(): void {
    if (!esElPrimero) alNavegar(indiceActual - 1);
  }

  function irSiguiente(): void {
    if (!esElUltimo) alNavegar(indiceActual + 1);
  }

  // Soporte de teclado
  useEffect(() => {
    function manejarTeclado(evento: KeyboardEvent): void {
      if (evento.key === 'ArrowLeft') irAnterior();
      else if (evento.key === 'ArrowRight') irSiguiente();
      else if (evento.key === 'Escape') alCerrar();
    }
    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, [indiceActual]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={alCerrar}
    >
      <div
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:text-gray-300 hover:bg-transparent"
          onClick={alCerrar}
          aria-label="Cerrar"
        >
          <X className="h-7 w-7" />
        </Button>

        {/* Contador */}
        <p className="text-white text-sm mb-3 font-medium">
          {indiceActual + 1} de {total}
        </p>

        {/* Imagen + flechas */}
        <div className="relative w-full flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={irAnterior}
            disabled={esElPrimero}
            className="absolute left-0 z-10 bg-black/50 hover:bg-black/70 text-white h-16 w-10 rounded-l-none rounded-r-lg disabled:opacity-30"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <img
            src={imagenes[indiceActual]}
            alt={`${prefijo} - Imagen ${indiceActual + 1}`}
            className="w-full max-h-[75vh] object-contain rounded-lg"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={irSiguiente}
            disabled={esElUltimo}
            className="absolute right-0 z-10 bg-black/50 hover:bg-black/70 text-white h-16 w-10 rounded-r-none rounded-l-lg disabled:opacity-30"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}