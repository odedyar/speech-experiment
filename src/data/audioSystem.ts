// מערכת השמעת קבצי אודיו לניסוי
export interface AudioSound {
  id: string;
  type: 'L' | 'S'; // L = ארוך, S = קצר
  audioFile: string;
  description: string;
}

// הגדרת הצלילים
export const audioSounds: AudioSound[] = [
  {
    id: 'long',
    type: 'L',
    audioFile: `${process.env.PUBLIC_URL}/audio/pim-long.mp3`, // קובץ הפים הארוך
    description: 'פים ארוך'
  },
  {
    id: 'short', 
    type: 'S',
    audioFile: `${process.env.PUBLIC_URL}/audio/pip-short.mp3`, // קובץ הפיפ הקצר
    description: 'פיפ קצר'
  }
];

// פונקציה להשמעת צליל יחיד
export const playAudioSound = (soundType: 'L' | 'S'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sound = audioSounds.find(s => s.type === soundType);
    if (!sound) {
      console.error(`Sound type ${soundType} not found`);
      reject(new Error(`Sound type ${soundType} not found`));
      return;
    }

    console.log(`Attempting to play: ${sound.audioFile}`);
    const audio = new Audio(sound.audioFile);
    
    audio.onended = () => {
      console.log(`Successfully played: ${sound.audioFile}`);
      resolve();
    };
    
    audio.onerror = (e) => {
      console.error(`Failed to play ${sound.audioFile}:`, e);
      reject(new Error(`Failed to play ${sound.audioFile}`));
    };
    
    audio.play().catch((playError) => {
      console.error(`Play promise rejected for ${sound.audioFile}:`, playError);
      reject(playError);
    });
  });
};

// פונקציה להשמעת צירוף צלילים
export const playTripletSequence = async (triplet: string): Promise<void> => {
  for (let i = 0; i < triplet.length; i++) {
    const soundType = triplet[i] as 'L' | 'S';
    await playAudioSound(soundType);
    
    // הפסקה של 300ms בין צלילים (חוץ מהאחרון)
    if (i < triplet.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
};
