import type React from 'react';
import { GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';
 
interface CompararProps {
  propertyId: string;
  compareList: string[];
  onToggleCompare: (id: string) => void;
}
 
export function CompareButton({
  propertyId,
  compareList,
  onToggleCompare,
}: CompararProps): React.ReactElement {
  const isSelected = compareList.includes(propertyId);
  const isFull = compareList.length >= 3 && !isSelected;
 
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      disabled={isFull}
      onClick={() => onToggleCompare(propertyId)}
      title={
        isFull
          ? 'Máximo 3 propiedades para comparar'
          : isSelected
          ? 'Quitar de comparación'
          : 'Agregar a comparación'
      }
      className={
        isSelected
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0'
          : 'hover:border-emerald-500 hover:text-emerald-600'
      }
    >
      <GitCompareArrows className="h-4 w-4 mr-1" />
      {isSelected ? 'Comparando' : 'Comparar'}
    </Button>
  );
}