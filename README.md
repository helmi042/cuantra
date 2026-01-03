# CUANTRA Personal Finance

Next.js + TypeScript + Tailwind + Prisma + MySQL personal finance tracker.

## Fitur inti (MVP)
- Autentikasi (credentials + opsi OAuth Google)
- Dashboard, akun, kategori, transaksi, laporan
- Validasi dengan Zod, data terisolasi per pengguna

## Persiapan lingkungan
1) **Instal dependensi**
```bash
npm install
```

2) **Konfigurasi environment**  
Buat `.env` berdasarkan `.env.example` lalu isi:
- `DATABASE_URL` & `SHADOW_DATABASE_URL` (MySQL)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (contoh: `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (opsional)

3) **Prisma migrate & seed**
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4) **Jalankan dev server**
```bash
npm run dev
```

Timezone default: `Asia/Jakarta`. Format mata uang: Rupiah (Intl.NumberFormat `id-ID`).
