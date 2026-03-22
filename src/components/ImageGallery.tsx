import type React from 'react';
import { useState } from 'react';
import { ImageModal } from './ImageModal';

interface PropiedadesImageGallery {
  imagenes: string[];
  prefijo?: string;
}

export function ImageGallery({ imagenes, prefijo = 'Propiedad' }: PropiedadesImageGallery): React.ReactElement | null {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState<number | null>(null);

  const modalEstaAbierto = indiceSeleccionado !== null;

  function abrirModal(indice: number): void {
    setIndiceSeleccionado(indice);
  }

  function cerrarModal(): void {
    setIndiceSeleccionado(null);
  }

  if (imagenes.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {imagenes.map((urlImagen, indice) => (
          <button
            key={indice}
            onClick={() => abrirModal(indice)}
            className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={urlImagen}
              alt={`${prefijo} - Imagen ${indice + 1}`}
              className="w-full h-24 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </button>
        ))}
      </div>

      {modalEstaAbierto && (
        <ImageModal
          imagenes={imagenes}
          indiceActual={indiceSeleccionado!}
          prefijo={prefijo}
          alCerrar={cerrarModal}
          alNavegar={setIndiceSeleccionado}
        />
      )}
    </>
  );
}