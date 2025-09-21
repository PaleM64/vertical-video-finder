import { NextRequest, NextResponse } from 'next/server';
import { PexelsProvider } from '@/lib/pexels';
import { SearchOptions } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Pexels API key not configured' }, { status: 500 });
  }

  try {
    const options: SearchOptions = {
      query,
      filters: {
        onlyVertical: searchParams.get('onlyVertical') === 'true',
        maxDuration: searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration')!) : undefined,
        includeApproximateVertical: searchParams.get('includeApproximateVertical') === 'true',
        sources: ['pexels']
      },
      maxResults: searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : 20,
      sortBy: (searchParams.get('sortBy') as 'relevance' | 'date' | 'duration') || 'relevance'
    };

    const pexels = new PexelsProvider(apiKey);
    const results = await pexels.search(options);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Pexels API error:', error);
    return NextResponse.json(
      { error: 'Failed to search Pexels videos' },
      { status: 500 }
    );
  }
}
