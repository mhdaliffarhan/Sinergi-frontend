# 🚀 Panduan Deployment SATSET Frontend (Hestia CP)

Dokumen ini menjelaskan langkah-langkah detail untuk meng-hosting **SATSET Frontend (Vue.js)** di server Hestia CP menggunakan alur Git Pull.

---

## 📋 Detail Server
- **Host**: Hestia CP BPS NTB
- **Domain**: `satset.statsntb.id`
- **Path**: `/home/user/web/satset.statsntb.id/public_html`
- **Stack**: Nginx (Static Site)

---

## 🛠 Langkah-Langkah Instalasi

### 1. Buat Web Domain di Hestia CP
- Login ke panel Hestia CP.
- Masuk ke menu **Web** -> **Add Web Domain**.
- Masukkan domain: `satset.statsntb.id`.
- Aktifkan **SSL (Let's Encrypt)**.

### 2. Deploy via Git
Di halaman detail Web Domain `satset.statsntb.id`:
- Klik opsi **Git**.
- Masukkan **Repository URL**: `https://github.com/mhdaliffarhan/satset-frontend.git`.
- Branch: `main`.

### 3. Konfigurasi dan Build
Ada dua cara untuk melakukan ini:

**Opsi A: Build Secara Lokal (Direkomendasikan)**
1. Jalankan `npm run build` di komputer lokal kamu.
2. Upload seluruh isi folder `dist/` ke direktori `public_html` di server via FTP/File Manager.

**Opsi B: Build di Server (Via SSH)**
Jika server memiliki Node.js:
```bash
cd /home/user/web/satset.statsntb.id/public_html
npm install
npm run build
```

### 4. Konfigurasi Nginx untuk SPA (Penting!)
Agar rute internal (seperti `/dashboard`) tidak error saat di-refresh, tambahkan konfigurasi ini di Advanced Options Nginx di Hestia CP:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 5. Konfigurasi Environment (`.env`)
Pastikan variabel `VITE_API_BASE_URL` mengarah ke domain API yang benar sebelum proses build dilakukan.

---

## 🆘 Troubleshooting

| Gejala | Solusi |
| :--- | :--- |
| **Halaman Putih (Blank)** | Cek `VITE_API_BASE_URL` di `.env` dan pastikan build berhasil. |
| **Error 404 saat Refresh** | Tambahkan rute `try_files` di konfigurasi Nginx (Langkah 4). |
| **Aset (CSS/JS) tidak muncul** | Pastikan file berada di root `public_html`, bukan di dalam subfolder `dist`. |

---

## 🔄 Pembaruan Berkelanjutan
```bash
# Jika melakukan build di server
git pull origin main
npm run build
```

---

## 📜 Copyright
© 2026 **Tim IPDS Provinsi Nusa Tenggara Barat**
