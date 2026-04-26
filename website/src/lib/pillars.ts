/**
 * Fuente única de verdad para pilares editoriales.
 * titleEs: nombre en español para navegación, chips y titulares.
 * Rutas slug se mantienen por SEO y enlaces existentes (redirects si cambian).
 */
export type PillarId = 'p1' | 'p2' | 'p3' | 'p4';

export interface PillarDefinition {
  id: PillarId;
  slug: string;
  number: string;
  /** Nombre del pilar en español (UI). */
  titleEs: string;
  subtitleEs: string;
  /** Definición editorial del pilar (fichas, meta, listados). */
  description: string;
}

export const PILLARS: readonly PillarDefinition[] = [
  {
    id: 'p1',
    slug: 'geopolitik-drop',
    number: '01',
    titleEs: 'Geopolitik Drop',
    subtitleEs: 'Conflictos y tendencias globales',
    description:
      'Lectura directa de conflictos, alianzas y movimientos de poder global para entender lo que cambia el equilibrio internacional.',
  },
  {
    id: 'p2',
    slug: 'bass-and-borders',
    number: '02',
    titleEs: 'Bass & Borders',
    subtitleEs: 'Música, cultura e identidad',
    description:
      'La escena cultural como mapa político: ciudades, circuitos y fronteras donde la música revela identidad, pertenencia y cambio social.',
  },
  {
    id: 'p3',
    slug: 'frecuencia-global',
    number: '03',
    titleEs: 'Frecuencia Global',
    subtitleEs: 'Noticias rápidas 60-90s',
    description:
      'Resumen ágil de lo más relevante: claves internacionales y contexto esencial en piezas cortas, claras y accionables.',
  },
  {
    id: 'p4',
    slug: 'behind-the-policy',
    number: '04',
    titleEs: 'Behind the Policy',
    subtitleEs: 'Política pública e implicaciones',
    description:
      'Análisis formal de decisiones públicas, regulación e impacto real sobre instituciones, mercados y ciudadanía.',
  },
] as const;

export const PILLAR_BY_SLUG: Record<string, PillarDefinition> = Object.fromEntries(
  PILLARS.map((p) => [p.slug, p]),
);

export const PILLAR_BY_ID: Record<PillarId, PillarDefinition> = Object.fromEntries(
  PILLARS.map((p) => [p.id, p]),
) as Record<PillarId, PillarDefinition>;

export function pillarPath(slug: string): string {
  return `/pilares/${slug}`;
}

export function getPillarBySlug(slug: string): PillarDefinition | undefined {
  return PILLAR_BY_SLUG[slug];
}

/** Título de página en mayúsculas (listados / detalle de pilar). */
export function pillarPageTitle(p: PillarDefinition): string {
  return p.titleEs.toUpperCase();
}
