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
    subtitleEs: 'Conflictos y poder global',
    description:
      'Lecturas directas sobre alianzas, crisis y movimientos que cambian el equilibrio internacional.',
  },
  {
    id: 'p2',
    slug: 'bass-and-borders',
    number: '02',
    titleEs: 'Bass & Borders',
    subtitleEs: 'Música, cultura y territorio',
    description:
      'Música como infraestructura: cómo las escenas electrónicas organizan acceso, cuerpo y ciudad.',
  },
  {
    id: 'p3',
    slug: 'frecuencia-global',
    number: '03',
    titleEs: 'Frecuencia Global',
    subtitleEs: 'Radar rápido 60–90s',
    description:
      'Señales breves para entender noticias internacionales sin perder contexto.',
  },
  {
    id: 'p4',
    slug: 'behind-the-policy',
    number: '04',
    titleEs: 'Behind the Policy',
    subtitleEs: 'Decisiones públicas y consecuencias',
    description:
      'Políticas, regulación e instituciones explicadas por su impacto real.',
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
