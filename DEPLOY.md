# העלאת האתר ל-jworldclothes.com

## עדכון עיצוב/קוד — בלי למחוק מוצרים!

המוצרים שלך נשמרים ב-**`catalog.json`** על השרver — **לא** בתוך קבצי האתר.

### כשמעדכנים את האתר, העלה רק:
- `index.html`
- תיקיית `assets/` (חדשה)

### אל תמחק / אל תדרוס:
- **`catalog.json`** ← כל המוצרים שלך!
- **`api/catalog.php`** ← שומר מוצרים

### לפני כל עדכון (מומלץ):
Admin → **Export** → שמור JSON במחשב (גיבוי)

---

## Hostinger — החלפת WordPress באתר החדש (J-World Clothes)

> האתר שלך ב-Hostinger רץ על WordPress. האתר החדש הוא קבצים סטטיים — מחליפים את תוכן `public_html` וזהו.

### שלב 1 — גיבוי WordPress (חובה)

1. hPanel → **Websites** → **jworldclothes.com** → **Dashboard**
2. **Backups** → צור / הורד גיבוי (Files + Database)
3. (אופציונלי) **File Manager** → `public_html` → בחר הכל → **Compress** → הורד ZIP

### שלב 2 — בניית האתר על המחשב

```bash
cd C:\Projects\clothes-affiliate-hub
npm install
npm run build
```

הקבצים להעלאה נמצאים בתיקייה: **`dist`**

### שלב 3 — העלאה ב-Hostinger

1. hPanel → **Websites** → **jworldclothes.com** → **File Manager**
2. פתח **`public_html`**
3. **מחק** את כל הקבצים הישנים (wp-admin, wp-content, wp-includes, index.php וכו')
4. לחץ **Upload**
5. העלה **את כל התוכן** מתוך `dist`:
   - `index.html`
   - `.htaccess`
   - `_redirects`
   - `favicon.svg`, `icons.svg`
   - תיקיית **`assets`** (שלמה)
6. File Manager → **Settings** → הפעל **Show hidden files** — ודא ש-`.htaccess` קיים

### שלב 4 — WordPress — לא צריך יותר

| מה | מה לעשות |
|----|-----------|
| WP Admin | לא רלוונטי — Admin החדש: `/admin` |
| מסד נתונים MySQL | אפשר להשאיר — לא מפריע |
| SSL | כבר פעיל ב-Hostinger — ימשיך לעבוד |

### שלב 5 — בדיקה

- https://jworldclothes.com
- https://jworldclothes.com/admin (סיסמה: `jworld2026`)
- רענן ישירות: https://jworldclothes.com/category/women (לא אמור להיות 404)

### שלב 6 — מוצרים שלך

1. אם הוספת מוצרים ב-localhost → **Export** JSON מ-Admin
2. באתר החי → `/admin` → **Import** JSON

---

## שלב 1 — בניית קבצי Production (כללי)

בתיקיית הפרויקט, הרץ:

```bash
npm install
npm run build
```

נוצרת תיקייה **`dist`** — זה האתר המוכן להעלאה.

---

## שלב 2 — העלאה לשרת

### אופציה A: cPanel / אחסון רגיל (Apache)

1. היכנס ל-cPanel של jworldclothes.com
2. פתח **File Manager** → תיקיית `public_html` (או `www`)
3. **גבה** את הקבצים הישנים (ZIP) לפני מחיקה
4. מחק את הקבצים הישנים מתוך `public_html`
5. העלה **את כל התוכן** מתוך תיקיית `dist` (לא את התיקייה עצמה):
   - `index.html`
   - תיקיית `assets/`
   - `.htaccess` (חשוב — מאפשר ניווט ב-React)
6. ודא ש-`.htaccess` הועלה (הצג קבצים נסתרים)

### אופציה B: Netlify (חינם + SSL אוטומטי)

1. העלה את הפרויקט ל-GitHub
2. ב-[netlify.com](https://netlify.com) → **Add new site** → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. **Domain settings** → הוסף `jworldclothes.com`
6. ב-DNS של הדומיין, הצבע את הרשומות לפי הוראות Netlify

### אופציה C: Vercel

1. העלה ל-GitHub
2. ב-[vercel.com](https://vercel.com) → Import Project
3. הוסף דומיין `jworldclothes.com` בהגדרות
4. קובץ `vercel.json` כבר מוגדר בפרויקט

### אופציה D: Cloudflare Pages

1. GitHub → Cloudflare Pages → Connect
2. Build: `npm run build` | Output: `dist`
3. Custom domain: `jworldclothes.com`

---

## שלב 3 — DNS (אם משנים שרת)

| סוג | שם | ערך |
|-----|-----|-----|
| A | @ | IP של השרת / Netlify / Vercel |
| CNAME | www | jworldclothes.com או כתובת הספק |

---

## חשוב לדעת

- **Admin:** `https://jworldclothes.com/admin` — סיסמה: `jworld2026`
- **נתונים (מוצרים):** נשמרים ב-localStorage של הדפדפן — אחרי העלאה, הוסף מוצרים מחדש ב-Admin, או **Export JSON** מ-local ו-**Import** בשרת החי
- **SSL:** ודא ש-HTTPS פעיל (Let's Encrypt ב-cPanel או אוטומטי ב-Netlify/Vercel)

---

## בדיקה אחרי העלאה

- [ ] דף הבית נטען
- [ ] `/admin` נפתח
- [ ] `/category/women` עובד (רענון ישיר בדף — לא 404)
- [ ] קישור affiliate (`/go/...`) עובד
