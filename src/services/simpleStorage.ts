// פתרון זמני - שמירה בדפדפן ושליחה במייל
export const saveToLocalStorage = (userId: string, userInfo: any, recordings: any[]) => {
  const data = {
    userId,
    userInfo,
    recordings: recordings.map(r => ({
      filename: r.filename,
      type: r.type,
      triplet: r.triplet,
      timestamp: new Date().toISOString()
    })),
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem(`experiment_${userId}`, JSON.stringify(data));
};

export const emailResults = async (userId: string, userInfo: any, recordings: any[]) => {
  const subject = `תוצאות ניסוי דיבור - ${userInfo.name}`;
  const body = `
שלום,

התקבלו תוצאות ניסוי דיבור:
- שם: ${userInfo.name}
- מזהה: ${userId}
- תאריך: ${new Date().toLocaleDateString('he-IL')}
- כמות הקלטות: ${recordings.length}

הקבצים צורפו לאימייל.
  `;
  
  // פתיחת תוכנת מייל
  const mailtoLink = `mailto:researcher@university.ac.il?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink);
};
