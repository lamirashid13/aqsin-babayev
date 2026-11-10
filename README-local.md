# AQŞİN BABAYEV — 90

Bu layihə Aqşin Babayevin 90 illik yubileyi münasibətilə yaradılmış rəqəmsal ədəbi memorial və arxiv saytıdır. Layihə statik HTML, CSS və JavaScript ilə qurulub.

## Başlamaq

1. Proyekt qovluğuna daxil olun.
2. Kompleks serveri işə salın:
   ```bash
   cd C:\Users\PREDATOR\aqsin-babayev-90
   python -m http.server 8000
   ```
3. Brauzerdə bu ünvanı açın: http://localhost:8000

## GitHub və Vercel

- Əsas layihə qovluğu bu repository-nin root qovluğudur: `C:\Users\PREDATOR\aqsin-babayev-90`.
- GitHub repository: `lamirashid13/aqsin-babayev`, branch: `main`.
- Vercel production saytı: `https://aqsin-babayev.vercel.app/`.
- Vercel layihəsində Root Directory `.` olmalıdır; build command və output directory override edilməməlidir.
- Dəyişiklikləri bu qovluqda edin, `main` branch-ə push edin və production deployment-i yoxlayın.

## Struktur

- `index.html` — əsas ana səhifə
- `pages/` — əlavə səhifələr
- `assets/css/styles.css` — stil və dizayn sistemi
- `assets/js/app.js` — interaktivlik və filtrlər
- `assets/js/site-data.js` — məlumatlar və fotoqalereya siyahısı
- `assets/images/placeholder/` — yer tutucu qrafiklər

## Məzmunu dəyişmək

- Mətni dəyişmək üçün HTML fayllarını redaktə edin.
- Timeline və digər məlumatları `site-data.js` içərisindən dəyişə bilərsiniz.
- Qalereya elementlərini `site-data.js` içərisində artırın.

## Məhdudiyyətlər

Layihədə istifadə olunan foto, audio və video materiallar hələ tam şəkildə təqdim olunmayıb. Düzgün arxiv şəkilləri əlavə edildikdə, `site-data.js` içindəki yollar dəyişdirilir.
