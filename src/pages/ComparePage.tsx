import type React from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize2,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
  GitCompareArrows,
  MapPin,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPropertyById } from '@/lib/storage';
import type { Property } from '@/types/property';
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from '@/types/property';


const CARD_COLORS = [
  {
    bg: 'from-blue-500 to-blue-700',
    border: 'border-blue-400',
    badge: 'bg-blue-100 text-blue-800',
    accent: 'text-blue-600',
    ring: 'ring-blue-400',
  },
  {
    bg: 'from-emerald-500 to-emerald-700',
    border: 'border-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800',
    accent: 'text-emerald-600',
    ring: 'ring-emerald-400',
  },
  {
    bg: 'from-amber-500 to-orange-600',
    border: 'border-amber-400',
    badge: 'bg-amber-100 text-amber-800',
    accent: 'text-amber-600',
    ring: 'ring-amber-400',
  },
];


function formatPrice(price: number, operationType: string): string {
  return operationType === 'alquiler'
    ? `${price.toLocaleString('es-ES')} US$/mes`
    : `${price.toLocaleString('es-ES')} US$`;
}

function pricePerSqm(price: number, area: number): number {
  return area > 0 ? Math.round(price / area) : 0;
}


interface MetricRow {
  label: string;
  icon: React.ReactNode;
  getValue: (p: Property) => number | string;
  getBest: (props: Property[]) => string | null; 
  higherIsBetter: boolean;
  format: (v: number | string) => string;
}


interface ComparePageProps {
  compareList: string[];
  onToggleCompare: (id: string) => void;
}


export function ComparePage({
  compareList,
  onToggleCompare,
}: ComparePageProps): React.ReactElement {
  
  const properties = useMemo<Property[]>(
    () =>
      compareList
        .map((id) => getPropertyById(id))
        .filter((p): p is Property => p !== null && p !== undefined),
    [compareList]
  );

  const metrics: MetricRow[] = useMemo(
    () => [
      {
        label: 'Precio',
        icon: <Tag className="h-4 w-4" />,
        getValue: (p) => p.price,
        higherIsBetter: false,
        getBest: (props) => {
          const min = Math.min(...props.map((p) => p.price));
          return props.find((p) => p.price === min)?.id ?? null;
        },
        format: (v) => `${Number(v).toLocaleString('es-ES')} US$`,
      },
      {
        label: 'Habitaciones',
        icon: <Bed className="h-4 w-4" />,
        getValue: (p) => p.bedrooms,
        higherIsBetter: true,
        getBest: (props) => {
          const max = Math.max(...props.map((p) => p.bedrooms));
          return props.find((p) => p.bedrooms === max)?.id ?? null;
        },
        format: (v) => `${v}`,
      },
      {
        label: 'Baños',
        icon: <Bath className="h-4 w-4" />,
        getValue: (p) => p.bathrooms,
        higherIsBetter: true,
        getBest: (props) => {
          const max = Math.max(...props.map((p) => p.bathrooms));
          return props.find((p) => p.bathrooms === max)?.id ?? null;
        },
        format: (v) => `${v}`,
      },
      {
        label: 'Área',
        icon: <Maximize2 className="h-4 w-4" />,
        getValue: (p) => p.area,
        higherIsBetter: true,
        getBest: (props) => {
          const max = Math.max(...props.map((p) => p.area));
          return props.find((p) => p.area === max)?.id ?? null;
        },
        format: (v) => `${v} m²`,
      },
      {
        label: 'Precio / m²',
        icon: <TrendingDown className="h-4 w-4" />,
        getValue: (p) => pricePerSqm(p.price, p.area),
        higherIsBetter: false,
        getBest: (props) => {
          const min = Math.min(...props.map((p) => pricePerSqm(p.price, p.area)));
          return props.find((p) => pricePerSqm(p.price, p.area) === min)?.id ?? null;
        },
        format: (v) => `${Number(v).toLocaleString('es-ES')} US$/m²`,
      },
    ],
    []
  );

  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">

          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center h-full">
              <GitCompareArrows className="h-16 w-16 text-blue-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Sin propiedades para comparar</h2>
          <p className="text-muted-foreground mb-8">
            Selecciona hasta <strong>3 propiedades</strong> desde el listado usando el botón
            &ldquo;Comparar&rdquo; en cada tarjeta.
          </p>

          <Button asChild size="lg">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ir al listado
            </Link>
          </Button>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">


        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al listado
              </Link>
            </Button>

            <div className="h-8 w-px bg-border" />

            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <GitCompareArrows className="h-7 w-7 text-blue-600" />
                Comparar Propiedades
              </h1>
              <p className="text-muted-foreground text-sm">
                {properties.length} de 3 propiedades seleccionadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-3 w-8 rounded-full transition-all duration-300 ${
                  i < properties.length
                    ? CARD_COLORS[i].bg.replace('from-', 'bg-gradient-to-r from-').split(' ')[0] +
                      ' ' +
                      CARD_COLORS[i].bg.split(' ')[1]
                    : 'bg-slate-200'
                }`}
                style={{
                  background:
                    i < properties.length
                      ? `linear-gradient(to right, var(--tw-gradient-stops))`
                      : undefined,
                }}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{properties.length}/3</span>
          </div>
        </div>
        <div
          className={`grid gap-6 mb-10 ${
            properties.length === 1
              ? 'grid-cols-1 max-w-sm'
              : properties.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {properties.map((property, index) => {
            const colors = CARD_COLORS[index];
            return (
              <div
                key={property.id}
                className={`relative rounded-2xl border-2 ${colors.border} bg-white shadow-lg overflow-hidden
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`bg-gradient-to-br ${colors.bg} p-6 text-white relative`}>
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm
                    flex items-center justify-center text-xs font-bold">
                    #{index + 1}
                  </div>

                 
                  <button
                    onClick={() => onToggleCompare(property.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30
                      backdrop-blur-sm flex items-center justify-center transition-colors"
                    title="Quitar de comparación"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="mt-4 mb-2">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-xs font-semibold bg-white/25 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                        {OPERATION_TYPE_LABELS[property.operationType]}
                      </span>
                      <span className="text-xs font-semibold bg-white/25 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                        {PROPERTY_TYPE_LABELS[property.propertyType]}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold leading-tight mb-1">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {property.address}, {property.city}
                      </span>
                    </div>
                  </div>

                
                  <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                    <p className="text-xs text-white/70 mb-0.5">Precio</p>
                    <p className="text-2xl font-extrabold tracking-tight">
                      {formatPrice(property.price, property.operationType)}
                    </p>
                  </div>
                </div>

             
                <div className="grid grid-cols-3 divide-x divide-border border-b bg-slate-50/60">
                  {[
                    { icon: <Bed className="h-4 w-4" />, value: property.bedrooms, label: 'Hab.' },
                    { icon: <Bath className="h-4 w-4" />, value: property.bathrooms, label: 'Baños' },
                    { icon: <Maximize2 className="h-4 w-4" />, value: `${property.area}m²`, label: 'Área' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center py-3 px-2 gap-0.5">
                      <div className={colors.accent}>{stat.icon}</div>
                      <span className="font-bold text-sm">{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>

              
                <div className="px-4 py-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" /> Precio/m²
                  </span>
                  <span className={`font-semibold ${colors.accent}`}>
                    {pricePerSqm(property.price, property.area).toLocaleString('es-ES')} US$/m²
                  </span>
                </div>

              
                <div className="px-4 pb-4">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/property/${property.id}`}>Ver detalles</Link>
                  </Button>
                </div>
              </div>
            );
          })}

         
          {properties.length < 3 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50
              flex flex-col items-center justify-center p-8 text-center min-h-[320px]
              transition-colors hover:border-blue-300 hover:bg-blue-50/30">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <GitCompareArrows className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium mb-1">Agregar propiedad</p>
              <p className="text-xs text-slate-400 mb-4">
                Puedes comparar hasta 3 propiedades
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Ir al listado
                </Link>
              </Button>
            </div>
          )}
        </div>

       
        {properties.length >= 2 && (
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Análisis Comparativo
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Los mejores valores están resaltados en cada categoría
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left px-6 py-4 font-semibold text-slate-600 w-44">
                      Métrica
                    </th>
                    {properties.map((p, i) => {
                      const colors = CARD_COLORS[i];
                      return (
                        <th key={p.id} className="px-6 py-4 text-center font-semibold">
                          <span className={`inline-flex items-center gap-1.5 ${colors.accent}`}>
                            <span
                              className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-br ${colors.bg}`}
                            />
                            {p.title.length > 20 ? p.title.slice(0, 20) + '…' : p.title}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {metrics.map((metric, rowIdx) => {
                    const bestId = metric.getBest(properties);
                    return (
                      <tr
                        key={metric.label}
                        className={`border-b transition-colors ${
                          rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                        } hover:bg-blue-50/40`}
                      >
                      
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600 font-medium">
                            <span className="text-slate-400">{metric.icon}</span>
                            {metric.label}
                          </div>
                        </td>

                     
                        {properties.map((p, i) => {
                          const value = metric.getValue(p);
                          const isBest = p.id === bestId;
                          const colors = CARD_COLORS[i];

                          return (
                            <td key={p.id} className="px-6 py-4 text-center">
                              <div
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5
                                  font-semibold transition-all ${
                                    isBest
                                      ? `bg-gradient-to-r ${colors.bg} text-white shadow-md scale-105`
                                      : 'text-slate-700'
                                  }`}
                              >
                                {isBest && (
                                  metric.higherIsBetter
                                    ? <TrendingUp className="h-3.5 w-3.5" />
                                    : <TrendingDown className="h-3.5 w-3.5" />
                                )}
                                {metric.format(value)}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

               
                  <tr className="border-b bg-white hover:bg-blue-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Tag className="h-4 w-4 text-slate-400" />
                        Operación
                      </div>
                    </td>
                    {properties.map((p, i) => (
                      <td key={p.id} className="px-6 py-4 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CARD_COLORS[i].badge}`}>
                          {OPERATION_TYPE_LABELS[p.operationType]}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-50/60 hover:bg-blue-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Home className="h-4 w-4 text-slate-400" />
                        Tipo
                      </div>
                    </td>
                    {properties.map((p, i) => (
                      <td key={p.id} className="px-6 py-4 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CARD_COLORS[i].badge}`}>
                          {PROPERTY_TYPE_LABELS[p.propertyType]}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

        
            <div className="px-6 py-4 bg-slate-50 border-t flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>El valor <strong>resaltado</strong> representa el mejor en esa categoría</span>
              <span className="mx-2">·</span>
              <TrendingDown className="h-3.5 w-3.5 text-blue-500" />
              <span>Para precio y precio/m², el <strong>menor</strong> es el mejor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}