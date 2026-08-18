# פריסה אוטומטית ל-jworldclothes.com

אחרי הגדרה חד-פעמית — **כל push ל-GitHub מעלה את האתר אוטומטית**.  
**לא צריך** File Manager / העלאה ידנית.

> **`catalog.json` (המוצרים שלך) לא נמחק** — הוא נשאר על השרver ולא נכלל ב-build.

---

## שלב 1 — GitHub (פעם אחת)

### 1. צור Repository חדש
- [github.com/new](https://github.com/new)
- שם: `jworld-clothes` (או כל שם)
- Private מומלץ

### 2. העלה את הקוד מהמחשב

פתח Terminal בתיקיית הפרויקט:

```bash
cd C:\Projects\clothes-affiliate-hub
git init
git add .
git commit -m "Initial commit - J-World Clothes"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jworld-clothes.git
git push -u origin main
```

(החלף `YOUR_USERNAME` בשם המשתמש שלך ב-GitHub)

---

## שלב 2 — פרטי FTP מ-Hostinger (פעם אחת)

1. hPanel → **Files** → **FTP Accounts**
2. רשום:
   - **FTP Host** (למשל `ftp.jworldclothes.com`)
   - **Username**
   - **Password**
   - **Directory** — בדרך כלל `public_html`

---

## שלב 3 — Secrets ב-GitHub (פעם אחת)

1. GitHub → Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** — הוסף:

| Secret | ערך |
|--------|-----|
| `FTP_SERVER` | כתובת FTP (בלי `ftp://`) |
| `FTP_USERNAME` | שם משתמש FTP |
| `FTP_PASSWORD` | סיסמת FTP |
| `FTP_SERVER_DIR` | `/public_html/` (אופציונלי) |
| `FTP_PORT` | `21` (אופציונלי) |

---

## שלב 4 — בדיקה

1. GitHub → **Actions** — תראה workflow **Deploy to Hostinger**
2. אחרי push מוצלח — האתר מתעדכן תוך ~1–2 דקות
3. בדוק: https://jworldclothes.com

---

## מעכשיו — עדכון האתר

```bash
# ערוך קוד ב-Cursor...
git add .
git commit -m "Describe your change"
git push
```

**זהו.** GitHub בונה ומעלה ל-Hostinger אוטומטית.

---

## פריסה ידנית (אם צריך)

GitHub → Actions → **Deploy to Hostinger** → **Run workflow**

---

## בעיות נפוצות

| בעיה | פתרון |
|------|--------|
| FTP failed | בדוק Secrets — host, user, password |
| אתר לא משתנה | Purge cache ב-Hostinger (LiteSpeed) |
| מוצרים נעלמו | אל תשים `catalog.json` ב-dist — כבר מוגדר נכון |

---

## אופציה B — Git מובנה ב-Hostinger

חלק מהתוכניות (Cloud Startup) תומכות:
hPanel → **Advanced** → **Git** → חבר GitHub → Auto Deploy

אם יש לך — אפשר גם דרך שם, בלי FTP Secrets.
