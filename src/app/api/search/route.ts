import { NextRequest, NextResponse } from 'next/server';
import { VideoResult, SearchOptions } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const options: SearchOptions = {
      query,
      filters: {
        onlyVertical: searchParams.get('onlyVertical') === 'true',
        maxDuration: searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration')!) : undefined,
        includeApproximateVertical: searchParams.get('includeApproximateVertical') === 'true',
        sources: (searchParams.get('sources')?.split(',') as ('youtube' | 'tiktok' | 'rednote' | 'pexels' | 'pixabay')[]) || ['youtube', 'tiktok', 'pexels', 'pixabay']
      },
      maxResults: searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : 20,
      sortBy: (searchParams.get('sortBy') as 'relevance' | 'date' | 'duration') || 'relevance'
    };

    const combinedResults: VideoResult[] = [];
    const baseUrl = request.nextUrl.origin;

    // Search each enabled source
    const searchPromises = options.filters.sources.map(async (source) => {
      try {
        const sourceParams = new URLSearchParams({
          q: options.query,
          onlyVertical: options.filters.onlyVertical.toString(),
          maxDuration: options.filters.maxDuration?.toString() || '',
          includeApproximateVertical: options.filters.includeApproximateVertical.toString(),
          maxResults: Math.ceil(options.maxResults! / options.filters.sources.length).toString(),
          sortBy: options.sortBy || 'relevance'
        });

        const response = await fetch(`${baseUrl}/api/search/${source}?${sourceParams}`, {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        }

        console.warn(`Failed to search ${source}: ${response.status}`);
        return [];
      } catch (error) {
        console.error(`Error searching ${source}:`, error);
        return [];
      }
    });

    const allResults = await Promise.all(searchPromises);
    combinedResults.push(...allResults.flat());

    // Sort results based on sortBy parameter
    const sortedResults = sortResults(combinedResults, options.sortBy || 'relevance');

    // Limit total results
    const limitedResults = sortedResults.slice(0, options.maxResults);

    return NextResponse.json({
      results: limitedResults,
      total: limitedResults.length,
      sources: options.filters.sources
    });

  } catch (error) {
    console.error('Combined search error:', error);
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    );
  }
}

function sortResults(results: VideoResult[], sortBy: string): VideoResult[] {
  switch (sortBy) {
    case 'date':
      return [...results].sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });
    case 'duration':
      return [...results].sort((a, b) => (a.duration || 0) - (b.duration || 0));
    case 'relevance':
    default:
      // Prioritize downloadable sources and then by view count
      return [...results].sort((a, b) => {
        // Downloadable videos get priority
        if (a.canDownload && !b.canDownload) return -1;
        if (!a.canDownload && b.canDownload) return 1;

        // Then sort by view count if available
        const aViews = a.viewCount || 0;
        const bViews = b.viewCount || 0;
        return bViews - aViews;
      });
  }
}
