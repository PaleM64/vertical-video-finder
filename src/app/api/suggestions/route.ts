import { NextRequest, NextResponse } from 'next/server';
import { generateKeywordSuggestions } from '@/lib/suggest';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 });
  }

  try {
    const suggestions = generateKeywordSuggestions(keyword);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Keyword suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate keyword suggestions' },
      { status: 500 }
    );
  }
}
