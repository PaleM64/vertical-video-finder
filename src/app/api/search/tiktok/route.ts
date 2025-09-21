import { NextRequest, NextResponse } from 'next/server';
import { TikTokProvider } from '@/lib/tiktok';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const tiktok = new TikTokProvider();

    if (!tiktok.validateTikTokUrl(url)) {
      return NextResponse.json({ error: 'Invalid TikTok URL' }, { status: 400 });
    }

    const result = await tiktok.getOEmbedData(url);

    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch TikTok video data' }, { status: 404 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('TikTok oEmbed error:', error);
    return NextResponse.json(
      { error: 'Failed to process TikTok URL' },
      { status: 500 }
    );
  }
}
