import { VideoResult } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Download, Clock, Eye } from 'lucide-react';
import { getRatioLabel, calculateAspectRatio } from '@/lib/ratio';

interface ResultCardProps {
  video: VideoResult;
  onPreview: (video: VideoResult) => void;
  onDownload: (video: VideoResult) => void;
}

export function ResultCard({ video, onPreview, onDownload }: ResultCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views?: number) => {
    if (!views) return '';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getSourceBadgeColor = (source: VideoResult['source']) => {
    switch (source) {
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'tiktok': return 'bg-pink-100 text-pink-800';
      case 'pexels': return 'bg-green-100 text-green-800';
      case 'pixabay': return 'bg-blue-100 text-blue-800';
      case 'rednote': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const aspectRatio = video.width && video.height
    ? calculateAspectRatio(video.width, video.height)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[9/16] bg-gray-100">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className={getSourceBadgeColor(video.source)}>
            {video.source.toUpperCase()}
          </Badge>
          {aspectRatio && (
            <Badge variant="secondary">
              {getRatioLabel(aspectRatio)}
            </Badge>
          )}
        </div>

        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
          {video.title}
        </h3>

        <p className="text-gray-600 text-xs mb-2">
          {video.channelTitle}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {video.viewCount && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(video.viewCount)}
            </div>
          )}

          <Badge variant="outline" className="text-xs">
            {video.license}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onPreview(video)}
            size="sm"
            className="flex-1"
          >
            <Play className="w-3 h-3 mr-1" />
            Preview
          </Button>

          <Button
            onClick={() => onDownload(video)}
            size="sm"
            variant="secondary"
            className="flex-1"
            disabled={!video.canDownload}
            title={video.canDownload ? "Download video" : "Unduhan tidak tersedia untuk sumber ini"}
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
