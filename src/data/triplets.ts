// השלשות לניסוי - 6 שלשות בסך הכל
export const triplets = [
  'akk', 'kka', 'aka', 'kok', 'oko', 'koo'
];

// השלשות לאימון - 3 שלשות נבחרות מראש
export const trainingTriplets = [
  'akk', 'kka', 'aka'
];

// פונקציה לבחירת שלשות אקראיות
export const getRandomTriplets = (count: number): string[] => {
  const shuffled = [...triplets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
