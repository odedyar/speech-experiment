// דוגמה לשימוש בקבצי אודיו מוקלטים מראש
export const audioTriplets = [
  {
    id: 'triplet1',
    text: 'בא-גא-דא',
    audioFile: '/audio/ba-ga-da.mp3'
  },
  {
    id: 'triplet2', 
    text: 'פא-טא-כא',
    audioFile: '/audio/pa-ta-ka.mp3'
  },
  {
    id: 'triplet3',
    text: 'מא-נא-לא', 
    audioFile: '/audio/ma-na-la.mp3'
  }
];

// פונקציה להשמעת קובץ אודיו
export const playAudioFile = (audioFile: string): Promise<void> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioFile);
    audio.onended = () => resolve();
    audio.play();
  });
};
