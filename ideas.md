# AnimeHub — Tasarım Fikirleri

## Yaklaşım 1: "Karanlık Sinema" — Noir Anime Arşivi

<response>
<text>
**Design Movement:** Neo-Noir / Cinematic Dark
**Core Principles:**
- Derin siyah ve koyu lacivert zemin; içerik ön planda
- Film afişi estetiği — her anime kartı bir sinema posteri gibi
- Dramatik ışık-gölge kontrastı
- Minimal ama güçlü tipografi

**Color Philosophy:** #0A0A0F ana zemin, #1A1A2E kart arka planı, #E94560 aksan rengi (kırmızı-pembe), #16213E ikincil yüzey. Renk paletinin amacı: gece yarısı sinema salonunun atmosferini yaratmak.

**Layout Paradigm:** Asimetrik masonry grid — kartlar farklı boyutlarda, "öne çıkan" animeler daha büyük. Solda sabit sidebar navigasyon.

**Signature Elements:**
- Kart hover'ında sinematik film şeridi efekti
- Başlıklar için "Bebas Neue" display font
- Kırmızı neon çizgi aksan elementleri

**Interaction Philosophy:** Hover'da kart büyür ve arka plan bulanıklaşır, spotlight efekti
**Animation:** Kartlar sayfa yüklenirken aşağıdan yukarı fade-in, hover'da scale(1.05) + glow
**Typography System:** Bebas Neue (başlıklar) + Nunito Sans (gövde metin)
</text>
<probability>0.08</probability>
</response>

## Yaklaşım 2: "Dijital Akış" — Cyberpunk Anime Database ✅ SEÇİLDİ

<response>
<text>
**Design Movement:** Cyberpunk / Digital Brutalism
**Core Principles:**
- Koyu arka plan üzerine parlak neon vurgular
- Veri odaklı görsel hiyerarşi — puanlar ve bilgiler ön planda
- Keskin köşeler ve geometrik şekiller
- Japonca tipografi aksan elementleri

**Color Philosophy:** #050510 zemin (neredeyse siyah lacivert), #7C3AED mor (primary), #06B6D4 cyan (secondary), #F59E0B amber (puan/yıldız). Amaç: anime dünyasının dijital-futuristik hissini vermek.

**Layout Paradigm:** Sol tarafta dar sidebar (filtreler + nav), sağda geniş içerik alanı. Üstte sticky arama çubuğu. Kartlar uniform grid ama hover'da dramatik transform.

**Signature Elements:**
- Neon glow efektleri (box-shadow ile)
- Puan göstergesi için özel radial progress
- Arka planda subtle grid/dot pattern

**Interaction Philosophy:** Her etkileşim anında görsel feedback verir; arama çubuğu yazarken gerçek zamanlı sonuçlar
**Animation:** framer-motion ile smooth geçişler, kart enter animasyonları, sayfa geçişlerinde slide
**Typography System:** "Orbitron" (logo/başlık) + "Space Grotesk" (UI) + "Noto Sans JP" (Japonca metinler)
</text>
<probability>0.09</probability>
</response>

## Yaklaşım 3: "Japon Minimalizmi" — Wabi-Sabi Anime Rehberi

<response>
<text>
**Design Movement:** Japanese Minimalism / Wabi-Sabi
**Core Principles:**
- Beyaz ve krem zemin, çok az renk
- Bol boşluk, nefes alan tasarım
- El yazısı hissi veren tipografi
- Sakura ve ink brush aksan elementleri

**Color Philosophy:** #FAFAF7 zemin, #1C1C1E metin, #D4A5A5 pembe aksan, #8B7355 toprak tonu. Amaç: Japon estetik felsefesini dijitale taşımak.

**Layout Paradigm:** Geniş, centered tek kolon layout. Kartlar yatay strip şeklinde, büyük görseller solda metin sağda.

**Signature Elements:**
- Ince çizgi border elementleri
- Sakura petal animasyonu
- Brush stroke divider'lar

**Interaction Philosophy:** Yavaş, kasıtlı animasyonlar; hover'da subtle renk değişimi
**Animation:** Yavaş fade-in, gentle parallax
**Typography System:** "Playfair Display" (başlıklar) + "Source Serif 4" (gövde)
</text>
<probability>0.07</probability>
</response>

---

## Seçilen Tasarım: Yaklaşım 2 — "Dijital Akış" Cyberpunk Anime Database

**Renk Paleti:**
- Zemin: `#050510` (neredeyse siyah lacivert)
- Kart yüzeyi: `#0D0D1A`
- Primary: `#7C3AED` (mor)
- Secondary: `#06B6D4` (cyan)
- Aksan: `#F59E0B` (amber — puanlar için)
- Metin: `#E2E8F0` (açık gri)
- Muted: `#64748B`

**Fontlar:**
- Logo/Başlık: Orbitron
- UI: Space Grotesk
- Gövde: Inter (fallback)
