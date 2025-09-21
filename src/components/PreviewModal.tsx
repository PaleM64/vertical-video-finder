import { VideoResult } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';
import { getRatioLabel, calculateAspectRatio } from '@/lib/ratio';

interface PreviewModalProps {
  video: VideoResult | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (video: VideoResult) => void;
  onShowLegal: (video: VideoResult) => void;
}

export function PreviewModal({
  video,
  isOpen,
  onClose,
  onDownload,
  onShowLegal
}: PreviewModalProps) {
  if (!video) return null;

  const aspectRatio = video.width && video.height
    ? calculateAspectRatio(video.width, video.height)
    : null;

  const renderVideoPreview = () => {
    switch (video.source) {
      case 'youtube':
        return (
          <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
            <iframe
              src={video.embedUrl}
              title={video.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'tiktok':
        return (
          <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
            {video.embedUrl ? (
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-center">
                  Preview tidak tersedia.<br />
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Lihat di TikTok
                  </a>
                </p>
              </div>
            )}
          </div>
        );

      case 'pexels':
      case 'pixabay':
        return (
          <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
            <video
              src={video.downloadUrl}
              poster={video.thumbnailUrl}
              controls
              className="w-full h-full object-cover"
            >
              Browser Anda tidak mendukung tag video.
            </video>
          </div>
        );

      case 'rednote':
        return (
          <div className="relative aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Preview Rednote belum tersedia
              </p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat di Rednote
              </a>
            </div>
          </div>
        );

      default:
        return (
          <div className="aspect-[9/16] bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Preview tidak tersedia</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold line-clamp-2">
            {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {renderVideoPreview()}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {video.source.toUpperCase()}
              </Badge>
              {aspectRatio && (
                <Badge variant="secondary">
                  {getRatioLabel(aspectRatio)}
                </Badge>
              )}
              <Badge variant="outline">
                {video.license}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Oleh: {video.channelTitle}
              </p>
              {video.duration && (
                <p className="text-sm text-gray-600">
                  Durasi: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onShowLegal(video)}
                variant="outline"
                className="flex-1"
              >
                Info Lisensi
              </Button>

              {video.canDownload ? (
                <Button
                  onClick={() => onDownload(video)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Gunakan Video Ini
                </Button>
              ) : (
                <Button
                  disabled
                  className="flex-1"
                  title="Unduhan tidak tersedia untuk sumber ini"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tidak Dapat Diunduh
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
