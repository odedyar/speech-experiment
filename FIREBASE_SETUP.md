# הגדרת Firebase לשמירת נתונים

## שלבים להגדרה:

### 1. יצירת פרויקט Firebase:
1. לך ל-https://console.firebase.google.com/
2. לחץ על "Add project"
3. תן שם לפרויקט (למשל: "speech-experiment")
4. המשך בשלבים

### 2. הגדרת Firestore Database:
1. בקונסול Firebase, לחץ על **"Firestore Database"** בתפריט השמאלי
2. לחץ על **"Create database"**
3. בחר **"Start in test mode"** (חשוב! - זה מאפשר גישה לפיתוח)
4. בחר **region**: `europe-west1` (מומלץ לישראל)
5. לחץ **"Enable"**
6. המתן עד שהמסד נוצר (כמה שניות)

**💡 טיפ**: "Test mode" פירושו שכל אחד יכול לכתוב ולקרוא מהמסד. זה בסדר לפיתוח, אבל בפרודקשן נצטרך לשנות את הכללים.

### 🔧 איך לשנות ממצב פרודקשן ל-Test Mode:
אם בחרת בטעות "פרודקשן", אל תדאג! אפשר לשנות:

1. בעמוד Firestore Database, לחץ על הטאב **"Rules"** (למעלה)
2. במקום הקוד המורכב שם, החלף בקוד הזה:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. לחץ **"Publish"**
4. הבסיס נתונים יהיה פתוח לכולם (מתאים לפיתוח)

**⚠️ זכור**: זה מתאים רק לפיתוח! בפרודקשן אמיתי נצטרך כללי אבטחה.

### 3. ~~הגדרת Storage~~ (מדלגים על זה):
**החלטנו לא לשמור קבצי אודיו כרגע** - רק את המידע על הביצועים.

זה חוסך:
- ✅ אין צורך בשדרוג לתוכנית בתשלום
- ✅ הגדרה פשוטה יותר
- ✅ רק Firestore Database מספיק

**מה נשמר:**
- פרטי המשתמש (שם, גיל, מין)
- זמן הביצוע של כל שלב
- מספר ההקלטות שבוצעו
- תאריך ושעה של הניסוי

### 4. הגדרת Web App:
1. בקונסול Firebase, לחץ על אייקון הרשת (`</>`) בדף הראשי
2. תן שם לאפליקציה (למשל: "speech-experiment")
3. **לא** לבחור "Firebase Hosting" כרגע
4. לחץ **"Register app"**
5. העתק את האובייקט `firebaseConfig` שמוצג
6. עדכן את הקובץ `src/firebase.ts` עם ההגדרות שלך

**דוגמה למה שתראה:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**איך לעדכן את הקובץ:**
1. פתח את הקובץ `src/firebase.ts`
2. החלף `YOUR_API_KEY_HERE` ב-`apiKey` שלך
3. החלף `YOUR_PROJECT_ID` ב-`projectId` שלך
4. וכן הלאה עבור כל השדות

**💡 טיפ**: שמור את הקוד שמוצג לך - תצטרך להעתיק אותו לקובץ firebase.ts

### 5. בדיקת החיבור:
אחרי שתעדכן את firebase.ts:
1. הפעל `npm start` (אם לא רץ כבר)
2. פתח את הקונסול של הדפדפן (F12)
3. התחל ניסוי חדש
4. אם הכל עובד, תראה הודעות בירוק בקונסול: "✅ נתוני הניסוי נשמרו בהצלחה!"

### 6. צפייה בנתונים:
כדי לראות את הנתונים שנשמרו:
1. בקונסול Firebase, לך ל-"Firestore Database"
2. תראה collection בשם "experiments"
3. כל ניסוי יופיע כמסמך עם כל הפרטים
