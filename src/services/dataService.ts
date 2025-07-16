import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserInfo, Recording } from '../types';

export interface ExperimentData {
  userId: string;
  userInfo: UserInfo;
  recordingsMetadata: Array<{
    filename: string;
    type: 'speech' | 'hum';
    triplet: string;
    recordingIndex: number;
  }>;
  timestamp: any;
}

export const saveExperimentData = async (
  userId: string,
  userInfo: UserInfo,
  recordings: Recording[]
): Promise<string> => {
  try {
    // שמירת מטאדטה בלבד (בלי קבצי אודיו)
    const recordingsMetadata = recordings.map((recording, index) => ({
      filename: recording.filename,
      type: recording.type,
      triplet: recording.triplet,
      recordingIndex: index
    }));

    // נתוני הניסוי לשמירה
    const experimentData: ExperimentData = {
      userId,
      userInfo,
      recordingsMetadata,
      timestamp: serverTimestamp()
    };

    // שמירה ב-Firestore בלבד
    const docRef = await addDoc(collection(db, 'experiments'), experimentData);
    
    console.log('✅ נתוני הניסוי נשמרו בהצלחה! Document ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ שגיאה בשמירת הנתונים:', error);
    throw error;
  }
};

// שורה זו מתקנת את שגיאת TypeScript
export {};
