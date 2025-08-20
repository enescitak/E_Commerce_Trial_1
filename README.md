<<<<<<< HEAD
# Fashion Admin Panel - Moda Mağazası Yönetim Paneli

Modern ve kullanıcı dostu bir moda mağazası yönetim paneli. Küçük ve orta ölçekli moda mağazaları için özel olarak tasarlanmıştır.

## 🚀 Özellikler

### ✅ Ana Dashboard
- **Günlük satış özeti** ve temel KPI'lar
- **Hızlı erişim** butonları (Yeni Ürün, Sipariş Görüntüle, vb.)
- **Son siparişler** ve **en çok satan ürünler** listesi
- **Düşük stok uyarıları** ve anlık bildirimler

### ✅ Ürün & Envanter Yönetimi (Temel Odak)
- **Kolay ürün ekleme**: Fotoğraf yükleme, isim, fiyat, beden/renk seçenekleri
- **Ürün CRUD işlemleri**: Tam ürün yaşam döngüsü yönetimi
- **Varyant yönetimi**: Farklı beden, renk ve özellik kombinasyonları
- **Kategori sistemi**: Esnek kategori organizasyonu
- **Stok takibi**: Otomatik stok güncellemeleri
- **Düşük stok bildirimleri**: Kritik stok seviyesi uyarıları
- **Aktif/Pasif ürün durumu** yönetimi

### ✅ Sipariş Yönetimi
- **Sipariş listesi** ve durum yönetimi (Beklemede, İşlemde, Kargoda, Teslim Edildi)
- **Tek tıkla sipariş işlemleri**: Durum güncelleme, kargo takibi
- **Müşteri bilgileri** ve sipariş detayları
- **Sipariş filtreleme** ve arama özellikleri

### ✅ Raporlama & Analitik
- **Satış metrikleri**: Günlük/aylık gelir, sipariş sayısı
- **En çok satan ürünler** analizi
- **Kategori performansı** grafikleri
- **Satış trendi** ve zaman bazlı analizler
- **Veri export** özelliği (JSON formatında)

### ✅ Ayarlar & Yönetim
- **Mağaza ayarları**: İsim, para birimi, saat dilimi
- **Kategori yönetimi**: Yeni kategori ekleme/düzenleme
- **Ürün özellik tanımları**: Renk, beden, materyal vb.
- **Bildirim ayarları**: Stok, sipariş bildirimleri

### ✅ Mobil Uyumlu Tasarım
- **Responsive design**: Telefon, tablet ve masaüstü uyumlu
- **Modern UI/UX**: Tailwind CSS ile şık ve kullanışlı arayüz
- **Kolay navigasyon**: Sezgisel menü yapısı

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6
- **State Management**: React Context + useReducer

## 📦 Kurulum

1. **Depoyu klonlayın**:
```bash
git clone <repo-url>
cd fashion-admin-panel
```

2. **Bağımlılıkları yükleyin**:
```bash
npm install
```

3. **Uygulamayı başlatın**:
```bash
npm start
```

4. **Tarayıcıda açın**: `http://localhost:3000`

## 🎯 Kullanım Kılavuzu

### Ürün Ekleme
1. **Dashboard** → **"Yeni Ürün"** butonuna tıklayın
2. **Temel bilgileri** girin (isim, açıklama, SKU, fiyat)
3. **Kategori** seçin
4. **Ürün fotoğrafları** yükleyin (sürükle-bırak destekli)
5. **Varyantlar** ekleyin (renk, beden kombinasyonları)
6. **Stok miktarları** ve uyarı seviyelerini belirleyin
7. **"Ürünü Oluştur"** ile kaydedin

### Sipariş Yönetimi
1. **Siparişler** sayfasına gidin
2. **Durum filtresi** ile siparişleri gruplandırın
3. **Hızlı eylemler** ile sipariş durumunu güncelleyin:
   - Beklemede → İşleme Al
   - İşlemde → Kargoya Ver
   - Kargoda → Teslim Et

### Raporları İnceleme
1. **Raporlar** seyfasına gidin
2. **Tarih aralığı** seçin (7 gün, 30 gün, 90 gün, 1 yıl)
3. **Farklı sekmeler** ile analizi derinleştirin:
   - **Genel Bakış**: KPI'lar ve trendler
   - **Ürün Analizi**: En çok satanlar, kategori dağılımı
   - **Sipariş Analizi**: Durum dağılımları

## 🔧 Özelleştirme

### Yeni Kategori Ekleme
- **Ayarlar** → **Kategoriler** → **"Kategori Ekle"**

### Ürün Özelliği Tanımlama
- **Ayarlar** → **Ürün Özellikleri** → **"Özellik Ekle"**
- Renk, beden, materyal gibi özellikler tanımlayın

### Bildirim Ayarları
- **Ayarlar** → **Bildirimler**
- Stok uyarıları, sipariş bildirimleri vb. ayarlayın

## 📊 Demo Verileri

Uygulama demo verileri ile gelir:
- **2 örnek ürün** (Kış Kazağı, Denim Pantolon)
- **3 kategori** (Kadın Giyim, Erkek Giyim, Aksesuar)
- **1 örnek sipariş**
- **Temel özellikler** (Renk, Beden)

## 🎨 Tasarım Prensipleri

- **Minimalist arayüz**: Gereksiz karmaşıklık yok
- **Büyük butonlar**: Kolay erişim ve mobile uyumluluk
- **Açık etiketler**: Her fonksiyon net şekilde işaretli
- **Görsel hiyerarşi**: Önemli bilgiler öne çıkarılmış
- **Tutarlı renkler**: Primary mavi tonları

## 🚀 Gelecek Özellikler

- **Kullanıcı yetkilendirme sistemi**
- **Gerçek ödeme entegrasyonu** (Stripe, PayPal)
- **E-posta bildirimleri**
- **Gelişmiş raporlama** (PDF export)
- **Müşteri yönetimi**
- **Tedarikçi entegrasyonu**

## 📱 Mobil Deneyim

Uygulama tam responsive tasarıma sahiptir:
- **📱 Mobil**: Kompakt menü, touch-friendly butonlar
- **📟 Tablet**: Optimized grid layouts
- **💻 Masaüstü**: Tam özellikli deneyim

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu bir demo uygulamasıdır. Gerçek e-ticaret kullanımı için ek güvenlik önlemleri ve backend entegrasyonu gereklidir.
=======
# E_Commerce_Trial_1
>>>>>>> origin/main
