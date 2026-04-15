const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// V2 Structure: One variant per row
const headers = [
  'Nama Produk', 
  'Kategori', 
  'Deskripsi Produk', 
  'Brand', 
  'Video URL', 
  'Tags (Pisah Koma)', 
  'Nama Varian', 
  'Harga Varian', 
  'Stok Varian', 
  'Gambar Varian (URL)',
  'Set Sebagai Default? (Y/N)'
];

const data = [
  {
    'Nama Produk': 'Balance Board Warna',
    'Kategori': 'Motorik Kasar',
    'Deskripsi Produk': 'Papan keseimbangan kayu berkualitas.',
    'Brand': 'ZAM Edutoys',
    'Video URL': '',
    'Tags (Pisah Koma)': 'Kayu, Montessori',
    'Nama Varian': 'Warna Merah',
    'Harga Varian': 150000,
    'Stok Varian': 10,
    'Gambar Varian (URL)': 'https://example.com/red.jpg',
    'Set Sebagai Default? (Y/N)': 'Y'
  },
  {
    'Nama Produk': 'Balance Board Warna',
    'Kategori': '', // Kosong karena produk sama
    'Deskripsi Produk': '',
    'Brand': '',
    'Video URL': '',
    'Tags (Pisah Koma)': '',
    'Nama Varian': 'Warna Biru',
    'Harga Varian': 150000,
    'Stok Varian': 15,
    'Gambar Varian (URL)': 'https://example.com/blue.jpg',
    'Set Sebagai Default? (Y/N)': 'N'
  },
  {
    'Nama Produk': 'Helper Tower',
    'Kategori': 'Furniture Anak',
    'Deskripsi Produk': 'Tower lipat multifungsi.',
    'Brand': 'ZAM Edutoys',
    'Video URL': 'https://example.com/demo.mp4',
    'Tags (Pisah Koma)': 'Safety, Furniture',
    'Nama Varian': 'Natural',
    'Harga Varian': 450000,
    'Stok Varian': 5,
    'Gambar Varian (URL)': 'https://example.com/tower.jpg',
    'Set Sebagai Default? (Y/N)': 'Y'
  }
];

const ws = XLSX.utils.json_to_sheet(data, { header: headers });
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Products & Variants');

const dir = path.join(process.cwd(), 'public/templates');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const filePath = path.join(dir, 'product_template.xlsx');
XLSX.writeFile(wb, filePath);

console.log('V2 Template created at:', filePath);
