# Vertical Video Finder

Aplikasi web untuk menemukan dan mengelola video vertikal (9:16) untuk konten Shorts dan Reels dalam bahasa Indonesia.

## ✨ Fitur Utama

- **Pencarian Multi-Platform**: YouTube, TikTok, Pexels, dan Pixabay
- **Filter Vertikal**: Deteksi otomatis rasio aspek 9:16
- **Preview Legal**: Embed resmi untuk YouTube dan TikTok
- **Download Aman**: Hanya untuk sumber yang mengizinkan (Pexels, Pixabay)
- **Saran Kata Kunci**: Generator otomatis kata kunci bahasa Indonesia
- **Filter Canggih**: Durasi, sumber, dan pengaturan aspek rasio

## 🚀 Teknologi

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **TypeScript**: Type safety penuh
- **API Integration**: YouTube Data API v3, Pexels API, Pixabay API

## 📋 Prasyarat

- Node.js 18+
- npm atau yarn
- API Keys (lihat Setup API Keys)

## 🛠️ Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd vertical-video-finder
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

4. **Konfigurasi API keys** (lihat bagian Setup API Keys)

5. **Jalankan development server**
```bash
npm run dev
```

6. Buka [http://localhost:3000](http://localhost:3000)

## 🔑 Setup API Keys

### YouTube Data API v3 (Gratis dengan kuota)
1. Buka [Google Cloud Console](https://console.developers.google.com/)
2. Buat project baru atau pilih yang sudah ada
3. Aktifkan YouTube Data API v3
4. Buat API Key di Credentials
5. Tambahkan ke `.env.local`: `YOUTUBE_API_KEY=your_key_here`

### Pexels Videos API (Gratis)
1. Daftar di [Pexels API](https://www.pexels.com/api/)
2. Dapatkan API key gratis
3. Tambahkan ke `.env.local`: `PEXELS_API_KEY=your_key_here`

### Pixabay Videos API (Gratis)
1. Buat akun di [Pixabay](https://pixabay.com/accounts/register/)
2. Kunjungi [API Documentation](https://pixabay.com/api/docs/)
3. Dapatkan API key
4. Tambahkan ke `.env.local`: `PIXABAY_API_KEY=your_key_here`

### TikTok API (Opsional)
1. Daftar di [TikTok for Developers](https://developers.tiktok.com/)
2. Buat aplikasi baru
3. Dapatkan Client ID dan Secret
4. Tambahkan ke `.env.local`:
   ```
   TIKTOK_CLIENT_ID=your_client_id
   TIKTOK_CLIENT_SECRET=your_client_secret
   ```

## 📖 Cara Penggunaan

### Pencarian Dasar
1. Masukkan kata kunci dalam bahasa Indonesia (contoh: "kucing lucu", "ikan bertelur")
2. Klik tombol "Cari" atau tekan Enter
3. Lihat hasil dari berbagai platform

### Filter Lanjutan
- **Sumber Video**: Pilih platform mana yang ingin dicari
- **Hanya 9:16**: Filter ketat untuk rasio vertikal
- **Durasi ≤ 60 detik**: Untuk konten Shorts
- **Sertakan Perkiraan 9:16**: Termasuk video yang kemungkinan vertikal

### Preview dan Download
- **Preview**: Klik tombol "Preview" untuk melihat video
- **Download**: Hanya tersedia untuk Pexels dan Pixabay
- **Info Lisensi**: Klik untuk melihat aturan penggunaan

## ⚖️ Batasan Legal

### Preview Saja
- **YouTube**: Hanya preview via embed resmi, tidak ada download
- **TikTok**: Preview terbatas, unduhan butuh izin pemilik konten
- **Rednote**: Preview terbatas (dalam pengembangan)

### Download Diizinkan
- **Pexels**: Gratis untuk pribadi dan komersial
- **Pixabay**: Gratis dengan syarat tertentu

### Penting
- Aplikasi ini menghormati ToS setiap platform
- Download hanya tersedia untuk sumber yang secara eksplisit mengizinkan
- Selalu periksa lisensi sebelum menggunakan konten

## 🏗️ Struktur Project

```
src/
├── app/
│   ├── api/search/          # API routes untuk setiap provider
│   ├── page.tsx             # Halaman utama
│   └── globals.css          # Styling global
├── components/
│   ├── ui/                  # Komponen shadcn/ui
│   ├── ResultCard.tsx       # Card hasil pencarian
│   ├── PreviewModal.tsx     # Modal preview video
│   ├── LegalDialog.tsx      # Dialog informasi lisensi
│   └── KeywordChips.tsx     # Chip saran kata kunci
└── lib/
    ├── types.ts             # TypeScript types
    ├── ratio.ts             # Utilitas aspect ratio
    ├── suggest.ts           # Generator kata kunci
    ├── youtube.ts           # Provider YouTube
    ├── pexels.ts            # Provider Pexels
    ├── pixabay.ts           # Provider Pixabay
    ├── tiktok.ts            # Provider TikTok
    └── rednote.ts           # Provider Rednote
```

## 🧪 Testing

```bash
# Run type checking
npm run build

# Run linting (jika dikonfigurasi)
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables di dashboard Vercel
4. Deploy otomatis

### Environment Variables untuk Production
Pastikan semua environment variables tersedia di platform hosting:
```
YOUTUBE_API_KEY
PEXELS_API_KEY
PIXABAY_API_KEY
TIKTOK_CLIENT_ID (opsional)
TIKTOK_CLIENT_SECRET (opsional)
```

## 🐛 Troubleshooting

### API Errors
- **YouTube 403**: Cek quota API atau validitas key
- **Pexels 401**: Verifikasi API key
- **Pixabay empty results**: Cek parameter pencarian

### No Results
- Coba kata kunci berbeda
- Ubah filter pencarian
- Pastikan minimal satu sumber aktif

### Preview Issues
- YouTube/TikTok: Normal jika embed tidak load di development
- Pexels/Pixabay: Cek koneksi internet dan CORS

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/nama-fitur`)
3. Commit changes (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

## 📝 License

MIT License - Lihat file [LICENSE](LICENSE) untuk detail.

## ⚠️ Disclaimer

Aplikasi ini dibuat untuk tujuan edukatif dan membantu creator konten. Pengguna bertanggung jawab untuk mematuhi terms of service setiap platform dan hukum hak cipta yang berlaku. Selalu periksa lisensi dan izin sebelum menggunakan konten.