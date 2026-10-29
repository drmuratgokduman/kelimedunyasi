# 🦉 Kelime Dünyası - Eş ve Zıt Anlamlı Sözcükler

İlkokul (1-4. sınıf) öğrencileri ve Türkçe öğrenmek isteyenler için tasarlanmış, **akıllı tekrar sistemi** ve **kategori bazlı çeldirici algoritması** barındıran, mobil, tablet ve masaüstü uyumlu (responsive) interaktif eğitim web uygulaması.

Tamamen **GitHub Pages** üzerinde çalışacak şekilde sunucusuz (statik HTML5, modern CSS3 ve Vanilla JavaScript) olarak geliştirilmiştir.

---

## 🌟 Öne Çıkan Özellikler

- **📱 Tam Cihaz Uyumluluğu (Responsive):**
  - Akıllı telefonlarda büyük ve ergonomik dokunmatik butonlar.
  - Tablet ve masaüstü bilgisayarlarda ferah 2x2 grid ve kart düzeni.
- **📚 %100 TDK ve MEB Müfredat Onayı:**
  - Yakın anlamlı veya deyimsel sözcüklerden arındırılmış, Türk Dil Kurumu'nda doğrudan tescilli tam eş ve zıt anlamlı kelime havuzu.
  - Her kelime için çocukların anlayacağı dilde sade tanım ve pekiştirici örnek cümle.
- **🎯 Semantik (Kategori Bazlı) Akıllı Çeldirici Algoritması:**
  - Soru kelimesi örneğin *"al"* (cevap *"kırmızı"*) ise, diğer 3 yanlış seçenek de mutlaka aynı kategoriden (renklerden: *sarı, beyaz, gri*) seçilir. Çocuk böylece rastgele değil, kavram alanı içinde düşünerek öğrenir.
- **🔁 Çoklu Deneme & Aralıklı Tekrar (Spaced Repetition):**
  - Yanlış bir şık seçildiğinde seçenek kırmızıya döner ve kilitlenir; kullanıcı doğru cevabı bulana kadar diğer şıkları denemeye devam edebilir.
  - Yanlış yapılan kelimeler hafızaya alınır ve 2-3 soru sonra aralarda tekrar sorularak kalıcı öğrenme sağlanır.
- **📖 Detay Bilgi Paneli & "Okudum" Butonu:**
  - Doğru cevap bulunduğunda kelimenin anlamını ve örnek cümlesini gösteren kutlama kartı açılır. "Okudum" butonuna tıklanınca sıradaki soruya geçilir.
- **⚡ Hızlı Soru Modu (Toggle):**
  - Üst bardaki şimşek (**⚡**) butonu tıklandığında bilgi paneli atlanır; doğru cevaptan 500 ms sonra doğrudan bir sonraki soruya geçilir (seri alıştırma modu).
- **🔊 Doğal Ses Efektleri:**
  - Web Audio API ile harici dosya indirmeden çalışan doğru, yanlış ve tıklama melodileri (istendiğinde tek tıkla sessize alınabilir).

---

## 🚀 GitHub Pages ile Canlıya Alma (Yayınlama Rehberi)

Bu projeyi GitHub Pages üzerinde tamamen ücretsiz olarak canlıya almak için aşağıdaki adımları izleyin:

### 1. Adım: Dosyaları GitHub Deponuza Yükleyin
Proje dizininde bir terminal (PowerShell veya Komut Satırı) açarak şu komutları çalıştırın:

```bash
# Git deposunu başlatın
git init

# Tüm dosyaları ekleyin
git add .

# İlk commit'i oluşturun
git commit -m "Kelime Dünyası ilk sürüm"

# GitHub'da oluşturduğunuz deponun adresini bağlayın
git branch -M main
git remote add origin https://github.com/<KULLANICI_ADINIZ>/<DEPO_ADINIZ>.git

# Dosyaları GitHub'a gönderin
git push -u origin main
```

### 2. Adım: GitHub Pages'i Etkinleştirin
1. GitHub'da ilgili deponuzun sayfasına gidin.
2. Üst menüden **Settings** (Ayarlar) sekmesine tıklayın.
3. Sol menüden **Pages** bölümünü seçin.
4. **Build and deployment** başlığı altında:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` ve klasör olarak `/ (root)` seçin.
5. **Save** (Kaydet) butonuna tıklayın.

### 3. Adım: Tebrikler, Yayındasınız! 🎉
1-2 dakika içinde GitHub size sayfanın en üstünde canlı web adresinizi verecektir:
👉 `https://<KULLANICI_ADINIZ>.github.io/<DEPO_ADINIZ>/`

Bu adresi tüm öğrenciler, öğretmenler veya velilerle paylaşabilir; mobilden, tabletten veya bilgisayardan doğrudan kullanabilirsiniz.

---

## 📂 Proje Dosya Yapısı

```text
KelimeEslestirme/
│
├── index.html          # Ana sayfa, soru ekranı, navbar ve bilgi paneli modalı
├── css/
│   └── style.css       # Mobil öncelikli, çocuk dostu ve mikro animasyonlu tasarım sistemi
├── js/
│   ├── wordsData.js    # %100 TDK onaylı kategorize edilmiş kelime veri tabanı
│   └── app.js          # Soru motoru, çeldirici mantığı, aralıklı tekrar ve ses sistemi
└── README.md           # Kurulum, dağıtım ve proje kılavuzu
```

---

## 💡 İpuçları
- **Yerel Olarak Çalıştırmak:** Proje klasöründe herhangi bir yerel sunucu (örneğin `python -m http.server 8080`) çalıştırarak veya doğrudan `index.html` dosyasını modern bir tarayıcıda çift tıklayarak açabilirsiniz.
- **Kelime Eklemek:** Yeni kelimeler eklemek için [`js/wordsData.js`](file:///c:/AntigravityProjets/KelimeEslestirme/js/wordsData.js) dosyasındaki ilgili kategori dizisine yeni bir obje eklemeniz yeterlidir.
