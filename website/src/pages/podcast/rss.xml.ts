import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function audioMimeType(url: string) {
  const lower = url.toLowerCase();
  if (lower.endsWith('.m4a')) return 'audio/mp4';
  if (lower.endsWith('.aac')) return 'audio/aac';
  if (lower.endsWith('.wav')) return 'audio/wav';
  if (lower.endsWith('.ogg')) return 'audio/ogg';
  return 'audio/mpeg';
}

export async function GET(context: APIContext) {
  const episodes = await getCollection('episodes', ({ data }) => !data.draft);
  const sorted = episodes.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
  const channelCover = new URL(
    sorted[0]?.data.coverImage ?? '/images/og/fg_og_default_1200x630.png',
    context.site,
  ).toString();
  const feedUrl = new URL('/podcast/rss.xml', context.site).toString();

  return rss({
    title: 'Frecuencia Global Podcast',
    description: 'Podcast semanal de Frecuencia Global: análisis internacional, cultura y tecnología con salida en audio RSS, web y videopodcast en YouTube.',
    site: context.site!.toString(),
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    },
    customData:
      `<language>es-MX</language>` +
      `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />` +
      `<itunes:author>Frecuencia Global</itunes:author>` +
      `<itunes:summary>Podcast semanal con análisis internacional, cultura y tecnología en formato audio-first con videopodcast en YouTube.</itunes:summary>` +
      `<itunes:owner><itunes:name>Frecuencia Global</itunes:name><itunes:email>contact@frecuenciaglobal.org</itunes:email></itunes:owner>` +
      `<itunes:image href="${escapeXml(channelCover)}" />` +
      `<itunes:explicit>false</itunes:explicit>` +
      `<itunes:type>episodic</itunes:type>` +
      `<itunes:category text="News"><itunes:category text="Politics" /></itunes:category>`,
    items: sorted.map((episode) => {
      const canonicalLink = `/podcast/${episode.id}/`;
      const itemCover = new URL(episode.data.coverImage, context.site).toString();

      return {
        title: episode.data.title,
        description: episode.data.description,
        pubDate: episode.data.publishDate,
        link: canonicalLink,
        enclosure: {
          url: episode.data.audioUrl,
          length: episode.data.audioBytes,
          type: audioMimeType(episode.data.audioUrl),
        },
        customData:
          `<guid isPermaLink="true">${escapeXml(new URL(canonicalLink, context.site).toString())}</guid>` +
          `<itunes:episode>${episode.data.episodeNumber}</itunes:episode>` +
          `<itunes:season>${episode.data.season}</itunes:season>` +
          `<itunes:duration>${escapeXml(episode.data.duration)}</itunes:duration>` +
          `<itunes:episodeType>full</itunes:episodeType>` +
          `<itunes:explicit>${episode.data.explicit ? 'true' : 'false'}</itunes:explicit>` +
          `<itunes:image href="${escapeXml(itemCover)}" />`,
      };
    }),
  });
}
