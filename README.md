# backend-test-seru

Project ini menggunakan `bun`, jadi ketika mencoba pada local development
diharapkan sudah menginstall `bun` pada komputer. Berikut adalah langkah-langkah untuk memulai
project ini pada local, untuk saat ini bila memakai docker ada beberapa error dan masih diperbaiki.

## Requirement

- Bun
- PostgreSQL

## Instalasi

**Install dependency menggunakan bun**

```bash
bun install
```

Jika ingin menggunakan package manager lain seperti `npm`, `yarn`, atau `pnpm`
maka, dapat dilakukan dengan menghapus `bun.lockb` terlebih dahulu lalu install dependency:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

## Konfigurasi `.env`

Sebelum menjalankan server, perlu menambahkan beberapa konfigurasi pada `.env`. Buat file baru bernama `.env` atau bisa juga rename
`.env.example` menjadi `.env`.

Berikut adalah variabel yang wajib ditambahkan, karena akan menghasilkan error apabila salah satu diantaranya kosong:

Pada project ini menggunakan database yang spesifik yaitu `postgres`.

```env
# port yang akan dijalankan pada server
NODE_PORT=

# Kredensial yang diperlukan untuk koneksi database postgre
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=

# kunci jwt token
JWT_SECRET=
```

## Migrasi

Sebelum melakukan migrasi database perlu pembuatan database baru sesuai dengan nama yang ada pada `.env`.

Setelah itu menjalankan perintah berikut untuk migrasi:

```bash
# bun
bun run db:migrate

# npm
npm run db:migrate
```

## Seeding

Proses selanjutnya adalah menjalankan seeding yaitu menambahkan beberapa data seperti admin dan lain sebagainya.

```bash
# bun
bun run db:seed

# npm
npm run db:seed
```

## Run server

Terakhir adalah menjalankan server dengan perintah:

```bash
# bun
bun run dev

# npm
npm run dev
```

Server akan berjalan sesuai port yang telah ditambahkan pada `.env`: http://localhost:{NODE_PORT}
