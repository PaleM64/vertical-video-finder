import { VideoResult } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Download } from 'lucide-react';

interface LegalDialogProps {
  video: VideoResult | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedDownload: (video: VideoResult) => void;
}

export function LegalDialog({
  video,
  isOpen,
  onClose,
  onProceedDownload
}: LegalDialogProps) {
  if (!video) return null;

  const getLegalInfo = () => {
    switch (video.source) {
      case 'youtube':
        return {
          title: 'YouTube - Hanya Preview',
          description: 'Video YouTube hanya dapat dipratinjau melalui embed resmi. Unduhan langsung tidak diizinkan sesuai Terms of Service YouTube.',
          license: video.license,
          canDownload: false,
          guidelines: [
            'Anda dapat menonton dan membagikan link video',
            'Unduhan langsung melanggar Terms of Service YouTube',
            'Gunakan fitur embed YouTube untuk menampilkan video di website Anda',
            'Untuk penggunaan komersial, hubungi pemilik konten langsung'
          ],
          links: [
            { label: 'YouTube Terms of Service', url: 'https://www.youtube.com/t/terms' },
            { label: 'Lihat Video Asli', url: video.url }
          ]
        };

      case 'tiktok':
        return {
          title: 'TikTok - Hanya Preview',
          description: 'Video TikTok hanya dapat dipratinjau. Unduhan memerlukan izin dari pembuat konten.',
          license: 'TikTok Terms of Service',
          canDownload: false,
          guidelines: [
            'Video dapat dibagikan melalui link TikTok',
            'Unduhan memerlukan izin eksplisit dari pembuat konten',
            'Penggunaan komersial harus sesuai dengan kebijakan TikTok',
            'Embed melalui oEmbed TikTok diperbolehkan'
          ],
          links: [
            { label: 'TikTok Terms of Service', url: 'https://www.tiktok.com/legal/terms-of-service' },
            { label: 'Lihat Video Asli', url: video.url }
          ]
        };

      case 'pexels':
        return {
          title: 'Pexels - Gratis untuk Digunakan',
          description: 'Video dari Pexels dapat diunduh dan digunakan secara gratis untuk proyek pribadi maupun komersial.',
          license: 'Pexels License',
          canDownload: true,
          guidelines: [
            '✅ Gratis untuk penggunaan pribadi dan komersial',
            '✅ Tidak perlu atribusi (tapi dihargai)',
            '✅ Dapat diedit dan dimodifikasi',
            '❌ Jangan jual kembali video tanpa modifikasi',
            '❌ Jangan gunakan untuk konten yang menyinggung'
          ],
          links: [
            { label: 'Pexels License', url: 'https://www.pexels.com/license/' },
            { label: 'Halaman Video Asli', url: video.url }
          ]
        };

      case 'pixabay':
        return {
          title: 'Pixabay - Gratis untuk Digunakan',
          description: 'Video dari Pixabay dapat diunduh dan digunakan secara gratis dengan beberapa batasan.',
          license: 'Pixabay License',
          canDownload: true,
          guidelines: [
            '✅ Gratis untuk penggunaan pribadi dan komersial',
            '✅ Tidak perlu atribusi (tapi dihargai)',
            '✅ Dapat diedit dan dimodifikasi',
            '❌ Jangan jual kembali tanpa modifikasi signifikan',
            '❌ Maksimal 100.000 unduhan per hari untuk penggunaan digital'
          ],
          links: [
            { label: 'Pixabay License', url: 'https://pixabay.com/service/license/' },
            { label: 'Halaman Video Asli', url: video.url }
          ]
        };

      case 'rednote':
        return {
          title: 'Rednote - Hanya Preview',
          description: 'Video Rednote saat ini hanya mendukung preview. Fitur unduhan belum tersedia.',
          license: 'Rednote Terms of Service',
          canDownload: false,
          guidelines: [
            'Preview terbatas melalui platform',
            'Unduhan belum didukung',
            'Ikuti kebijakan platform Rednote',
            'Hubungi pembuat konten untuk izin penggunaan'
          ],
          links: [
            { label: 'Lihat Video Asli', url: video.url }
          ]
        };

      default:
        return {
          title: 'Informasi Lisensi',
          description: 'Informasi lisensi tidak tersedia.',
          license: 'Unknown',
          canDownload: false,
          guidelines: [],
          links: []
        };
    }
  };

  const legalInfo = getLegalInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {legalInfo.title}
          </DialogTitle>
          <DialogDescription>
            {legalInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {legalInfo.license}
            </Badge>
          </div>

          {legalInfo.guidelines.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Ketentuan Penggunaan:</h4>
              <ul className="space-y-2">
                {legalInfo.guidelines.map((guideline, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {legalInfo.links.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Link Terkait:</h4>
              <div className="space-y-2">
                {legalInfo.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Tutup
            </Button>

            {legalInfo.canDownload && video.canDownload && (
              <Button
                onClick={() => {
                  onProceedDownload(video);
                  onClose();
                }}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Lanjutkan Unduhan
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
