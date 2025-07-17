// צירופי צלילים לניסוי - 6 צירופים שונים
// "L" = צליל ארוך (פים), "S" = צליל קצר (פיפ)
export const triplets = [
  'LLS', 'SLS', 'LSL', 'LSS', 'SLL', 'SSL'
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

// פונקציה לבחירת שלשות אקראיות
export const getRandomTriplets = (count: number): string[] => {
  const shuffled = [...triplets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
