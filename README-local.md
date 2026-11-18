# AQŞİN BABAYEV — 90

Bu layihə Aqşin Babayevin 90 illik yubileyi münasibətilə yaradılmış rəqəmsal ədəbi memorial və arxiv saytıdır. Layihə statik HTML, CSS və JavaScript ilə qurulub.

## Başlamaq

1. Repository-nin əsas qovluğuna daxil olun.
2. Kompleks serveri işə salın:
   ```bash
   python -m http.server 8000
   ```
3. Brauzerdə bu ünvanı açın: http://localhost:8000

## GitHub və Vercel

- Vercel üçün əsas layihə qovluğu repository-nin root qovluğudur.
- `Aqsin-Babayev-Website/` qovluğu ayrıca paylaşıla bilən sayt paketidir;
  dəyişikliklər dərc edilməzdən əvvəl uyğun kök faylları ilə sinxronlaşdırılmalıdır.
- GitHub repository: `lamirashid13/aqsin-babayev`, branch: `main`.
- Vercel production saytı: `https://aqsin-babayev.vercel.app/`.
- Vercel layihəsində Root Directory `.` olmalıdır; build command və output directory override edilməməlidir.
- Dəyişiklikləri bu qovluqda edin, `main` branch-ə push edin və production deployment-i yoxlayın.

## Struktur

- `index.html` — əsas ana səhifə
- `pages/` — əlavə səhifələr
- `style.css` — stil və dizayn sistemi
- `app.js` — interaktivlik və filtrlər
- `assets/js/site-data.js` — məlumatlar və fotoqalereya siyahısı
- `assets/images/` — portretlər, kitab üzlükləri və qalereya şəkilləri
- `assets/fonts/` — yerli şriftlər və onların lisenziyaları
- `assets/mp3/` — audio arxivi

## Məzmunu dəyişmək

- Mətni dəyişmək üçün HTML fayllarını redaktə edin.
- Timeline və digər məlumatları `site-data.js` içərisindən dəyişə bilərsiniz.
- Qalereya elementlərini `site-data.js` içərisində artırın.

## Məhdudiyyətlər

Sayt arxiv materiallarına görə təxminən 1 GB yer tutur; hostinq xidmətinin
yükləmə və saxlama limitlərini əvvəlcədən yoxlayın.
