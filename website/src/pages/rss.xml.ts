import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const sorted = articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Frecuencia Global',
    description: 'Análisis internacional con estética de club nocturno. Geopolítica, cultura y tecnología a otro ritmo.',
    site: context.site!.toString(),
    items: sorted.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: `/contenido/${article.id}/`,
    })),
    customData: '<language>es</language>',
  });
}
