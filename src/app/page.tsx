'use client'

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResultCard } from '@/components/ResultCard';
import { PreviewModal } from '@/components/PreviewModal';
import { LegalDialog } from '@/components/LegalDialog';
import { KeywordChips } from '@/components/KeywordChips';
import { VideoResult, SearchFilters } from '@/lib/types';
import { KeywordSuggestion, generateKeywordSuggestions, getPopularIndonesianKeywords } from '@/lib/suggest';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoResult | null>(null);
  const [legalVideo, setLegalVideo] = useState<VideoResult | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    onlyVertical: true,
    maxDuration: 60,
    includeApproximateVertical: true,
    sources: ['youtube', 'tiktok', 'pexels', 'pixabay']
  });

  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'duration'>('relevance');

  const popularKeywords = getPopularIndonesianKeywords();

  const debouncedGenerateSuggestions = useCallback(
    debounce((keyword: string) => {
      if (keyword.length > 2) {
        const newSuggestions = generateKeywordSuggestions(keyword);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedGenerateSuggestions(query);
  }, [query, debouncedGenerateSuggestions]);

  const searchVideos = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        onlyVertical: filters.onlyVertical.toString(),
        maxDuration: filters.maxDuration?.toString() || '',
        includeApproximateVertical: filters.includeApproximateVertical.toString(),
        maxResults: '20',
        sortBy
      });

      const promises = filters.sources.map(async (source) => {
        try {
          const response = await fetch(`/api/search/${source}?${searchParams}`);
          if (response.ok) {
            const data = await response.json();
            return data.results || [];
          }
          return [];
        } catch (error) {
          console.error(`Error searching ${source}:`, error);
          return [];
        }
      });

      const allResults = await Promise.all(promises);
      const combinedResults = allResults.flat();

      const sortedResults = sortResults(combinedResults, sortBy);
      setResults(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (results: VideoResult[], sortBy: string) => {
    switch (sortBy) {
      case 'date':
        return [...results].sort((a, b) => {
          const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return bDate - aDate;
        });
      case 'duration':
        return [...results].sort((a, b) => (a.duration || 0) - (b.duration || 0));
      default:
        return results;
    }
  };

  const handleSearch = () => {
    searchVideos(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSelectedKeywords(prev => [...prev, suggestion]);
    searchVideos(suggestion);
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handlePreview = (video: VideoResult) => {
    setPreviewVideo(video);
  };

  const handleDownload = async (video: VideoResult) => {
    if (!video.canDownload || !video.downloadUrl) {
      setLegalVideo(video);
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = video.downloadUrl;
      link.download = `${video.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Gagal mengunduh video. Silakan coba lagi.');
    }
  };

  const handleShowLegal = (video: VideoResult) => {
    setLegalVideo(video);
  };

  const toggleSource = (source: string) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source as any)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source as any]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pencari Video Vertikal
            </h1>
            <p className="text-gray-600">
              Temukan video vertikal untuk konten Shorts dan Reels Anda
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Cari ide video vertikal..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Popular Keywords */}
          {!query && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Kata kunci populer:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleSuggestionClick(keyword)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Suggestions */}
          <KeywordChips
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            selectedKeywords={selectedKeywords}
            onRemoveKeyword={handleRemoveKeyword}
          />

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <h3 className="font-semibold mb-4">Filter Pencarian</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sources */}
                <div>
                  <p className="font-medium mb-3">Sumber Video:</p>
                  <div className="space-y-2">
                    {[
                      { id: 'youtube', label: 'YouTube (preview)', color: 'text-red-600' },
                      { id: 'tiktok', label: 'TikTok (preview)', color: 'text-pink-600' },
                      { id: 'pexels', label: 'Pexels (download)', color: 'text-green-600' },
                      { id: 'pixabay', label: 'Pixabay (download)', color: 'text-blue-600' }
                    ].map((source) => (
                      <div key={source.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={source.id}
                          checked={filters.sources.includes(source.id as any)}
                          onCheckedChange={() => toggleSource(source.id)}
                        />
                        <label htmlFor={source.id} className={`text-sm ${source.color}`}>
                          {source.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Hanya 9:16 (vertikal)</label>
                    <Switch
                      checked={filters.onlyVertical}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, onlyVertical: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Durasi ≤ 60 detik</label>
                    <Switch
                      checked={filters.maxDuration === 60}
                      onCheckedChange={(checked) => setFilters(prev => ({
                        ...prev,
                        maxDuration: checked ? 60 : undefined
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sertakan perkiraan 9:16</label>
                    <Switch
                      checked={filters.includeApproximateVertical}
                      onCheckedChange={(checked) => setFilters(prev => ({
                        ...prev,
                        includeApproximateVertical: checked
                      }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Urutkan berdasarkan:</label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Paling relevan</SelectItem>
                        <SelectItem value="date">Terbaru</SelectItem>
                        <SelectItem value="duration">Durasi terpendek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Mencari video...</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  Ditemukan {results.length} video
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((video) => (
                  <ResultCard
                    key={`${video.source}-${video.id}`}
                    video={video}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && query && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Tidak ada video ditemukan untuk "{query}"
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Coba kata kunci yang berbeda atau ubah filter pencarian
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PreviewModal
        video={previewVideo}
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        onDownload={handleDownload}
        onShowLegal={handleShowLegal}
      />

      <LegalDialog
        video={legalVideo}
        isOpen={!!legalVideo}
        onClose={() => setLegalVideo(null)}
        onProceedDownload={handleDownload}
      />
    </div>
  );
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
