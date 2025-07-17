// צירופי צלילים לניסוי - כל הצירופים האפשריים
// "L" = צליל ארוך (פים), "S" = צליל קצר (פיפ)
export const triplets = [
  'LLL', 'LLS', 'LSL', 'LSS', 
  'SLL', 'SLS', 'SSL', 'SSS'
];

// צירופים לאימון - 3 צירופים פשוטים יותר
export const trainingTriplets = [
  'LLS', 'SLS', 'LSL'
];

// מיפוי לתיאור בעברית
export const soundDescriptions: { [key: string]: string } = {
  'L': 'פים ארוך',
  'S': 'פיפ קצר'
};

// המרת צירוף לתיאור
export const getTripletDescription = (triplet: string): string => {
  return triplet.split('').map(sound => soundDescriptions[sound]).join(', ');
};

// פונקציה לבחירת שלשות אקראיות (עם חזרות אם צריך)
export const getRandomTriplets = (count: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * triplets.length);
    result.push(triplets[randomIndex]);
  }
  return result;
};
