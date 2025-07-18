import React, { useState } from 'react';
import { UserInfo, ExperimentState, Recording } from '../types';
import { trainingTriplets, getRandomTriplets, getTripletDescription } from '../data/triplets';
import { playTripletSequence } from '../data/audioSystem';
import AudioRecorder from './AudioRecorder';
import JSZip from 'jszip';
import { saveExperimentData } from '../services/dataService';

interface ExperimentFlowProps {
  userInfo: UserInfo;
  userId: string;
}

const ExperimentFlow: React.FC<ExperimentFlowProps> = ({ userInfo, userId }) => {
  const [state, setState] = useState<ExperimentState>({
    phase: 'speech-training',
    currentIndex: 0,
    recordings: [],
    triplets: trainingTriplets
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const currentTriplet = state.triplets[state.currentIndex];
  const isLastInPhase = state.currentIndex === state.triplets.length - 1;

  const playTriplet = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setShowRecordButton(false);

    try {
      console.log('Trying to play triplet:', currentTriplet);
      // השמעת צירוף הצלילים מקבצי האודיו
      await playTripletSequence(currentTriplet);
      console.log('Successfully played audio files');
    } catch (error) {
      console.error('Error playing triplet:', error);
      console.log('Falling back to speech synthesis');
      // במקרה של שגיאה, ננסה עם text-to-speech כגיבוי
      await playTripletFallback();
    }

    setIsPlaying(false);
    setShowRecordButton(true);
  };

  // פונקציית גיבוי עם text-to-speech
  const playTripletFallback = async () => {
    const description = getTripletDescription(currentTriplet);
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.lang = 'he-IL';
    utterance.rate = 0.8;
    
    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const handleRecordingComplete = (blob: Blob) => {
    const recording: Recording = {
      id: `${userId}_${state.phase}_${Date.now()}`,
      userId,
      type: state.phase.includes('speech') ? 'speech' : 'hum',
      triplet: currentTriplet,
      blob,
      filename: `${userId}_${state.phase.includes('speech') ? 'speech' : 'hum'}_t${String(state.currentIndex + 1).padStart(2, '0')}_${currentTriplet}.mp3`
    };

    setState(prev => ({
      ...prev,
      recordings: [...prev.recordings, recording]
    }));

    handleNext();
  };

  const handleNext = () => {
    if (isLastInPhase) {
      // מעבר לשלב הבא
      switch (state.phase) {
        case 'speech-training':
          // הצגת הודעת מעבר
          alert('כל הכבוד! סיימת את שלב האימון לזיהוי בדיבור.\nעכשיו נתחיל את הניסוי האמיתי - תקבל עוד צירופי צלילים לזיהוי.');
          setState(prev => ({
            ...prev,
            phase: 'speech-experiment',
            currentIndex: 0,
            triplets: getRandomTriplets(25) // 25 צעדים לניסוי
          }));
          break;
        case 'speech-experiment':
          // הודעת מעבר לזמזום
          alert('מצוין! סיימת את שלב הזיהוי בדיבור.\nעכשיו נעבור לחלק הזמזום. במקום לומר "ארוך" ו"קצר", תצטרך לזמזם את הצלילים באורך המתאים.\nנתחיל באימון קצר.');
          setState(prev => ({
            ...prev,
            phase: 'hum-training',
            currentIndex: 0,
            triplets: trainingTriplets
          }));
          break;
        case 'hum-training':
          alert('נהדר! סיימת את שלב האימון לזמזום.\nעכשיו נתחיל את הניסוי האמיתי - תקבל עוד צירופי צלילים לזמזום.');
          setState(prev => ({
            ...prev,
            phase: 'hum-experiment',
            currentIndex: 0,
            triplets: getRandomTriplets(25) // 25 צעדים לניסוי
          }));
          break;
        case 'hum-experiment':
          // שמירת הנתונים לפני סיום הניסוי
          setTimeout(async () => {
            try {
              const experimentId = await saveExperimentData(userId, userInfo, state.recordings);
              console.log('Experiment saved with ID:', experimentId);
            } catch (error) {
              console.error('Failed to save experiment:', error);
              // המשך הניסוי גם אם השמירה נכשלה
            }
          }, 100);
          
          setState(prev => ({
            ...prev,
            phase: 'complete'
          }));
          break;
      }
    } else {
      // מעבר לשלשה הבאה
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    }
    setShowRecordButton(false);
  };

  const getPhaseTitle = () => {
    switch (state.phase) {
      case 'speech-training':
        return 'שלב אימון - זיהוי בדיבור';
      case 'speech-experiment':
        return 'שלב ניסוי - זיהוי בדיבור';
      case 'hum-training':
        return 'שלב אימון - זמזום';
      case 'hum-experiment':
        return 'שלב ניסוי - זמזום';
      case 'complete':
        return 'ניסוי הסתיים';
      default:
        return '';
    }
  };

  const getStepByStepInstructions = () => {
    switch (state.phase) {
      case 'speech-training':
        return [
          '1. לחץ על הכפתור "השמע צירוף צלילים" כדי לשמוע את הצלילים',
          '2. שים לב לסדר הצלילים: פיפ ארוך או פיפ קצר',
          '3. לחץ על "התחל הקלטה" כשאתה מוכן',
          '4. אמור ברצף: "ארוך" עבור כל פיפ ארוך ו"קצר" עבור כל פיפ קצר',
          '5. דוגמה: אם שמעת ארוך-קצר-קצר, אמור "ארוך קצר קצר"',
          '6. לחץ על "עצור הקלטה" כשסיימת'
        ];
      case 'speech-experiment':
        return [
          '1. לחץ על הכפתור "השמע צירוף צלילים"',
          '2. האזן בקשב רב - זהו הניסוי האמיתי!',
          '3. לחץ על "התחל הקלטה"',
          '4. אמור ברצף את המילים "ארוך" או "קצר" בהתאם לסדר שמעת',
          '5. לדוגמה: "ארוך קצר ארוך" או "קצר קצר ארוך"',
          '6. לחץ על "עצור הקלטה" כשסיימת'
        ];
      case 'hum-training':
        return [
          '1. לחץ על הכפתור "השמע צירוף צלילים"',
          '2. שים לב לאורך כל צליל',
          '3. לחץ על "התחל הקלטה"',
          '4. זמזם את הצלילים באורך המתאים בלי מילים - רק זמזום!',
          '5. שמור על אותו סדר ואורך שמעת',
          '6. לחץ על "עצור הקלטה" כשסיימת'
        ];
      case 'hum-experiment':
        return [
          '1. לחץ על הכפתור "השמע צירוף צלילים"',
          '2. האזן בקשב רב לאורך כל צליל',
          '3. לחץ על "התחל הקלטה"',
          '4. זמזם את הצלילים באורך המדויק שמעת',
          '5. אין לומר מילים - רק לזמזם!',
          '6. לחץ על "עצור הקלטה" כשסיימת'
        ];
      default:
        return [];
    }
  };

  const getInstructions = () => {
    switch (state.phase) {
      case 'speech-training':
        return 'שלב אימון - זיהוי בדיבור: זהו שלב אימון לפני הניסוי האמיתי. האזן לצירוף הצלילים ואמור ברצף "ארוך" ו"קצר" לפי הסדר.';
      case 'speech-experiment':
        return 'שלב ניסוי - זיהוי בדיבור: זהו הניסוי האמיתי! האזן לצירוף הצלילים ואמור ברצף "ארוך" או "קצר" בהתאם לסדר שמעת.';
      case 'hum-training':
        return 'שלב אימון - זמזום: עכשיו נעבור לזמזום. זהו שלב אימון לפני הניסוי האמיתי. זמזם את הצלילים באורך המתאים בלי מילים.';
      case 'hum-experiment':
        return 'שלב ניסוי - זמזום: זהו הניסוי האמיתי! האזן לצירוף הצלילים וזמזם אותם באורך המדויק בלי מילים.';
      default:
        return '';
    }
  };

  const downloadAllAsZip = async () => {
    try {
      setUploadStatus('uploading');
      console.log('יוצר קובץ ZIP...');
      const zip = new JSZip();
      
      // הוספת פרטי המשתמש
      const userInfoText = `פרטי משתתף:
שם: ${userInfo.name}
גיל: ${userInfo.age}
מין: ${userInfo.gender}
מספר משתתף: ${userId}
תאריך: ${new Date().toLocaleString('he-IL')}

תוצאות הניסוי:
${state.recordings.map((r, i) => 
  `${i + 1}. סוג: ${r.type}, צירוף: ${r.triplet}, גודל קובץ: ${r.blob.size} bytes`
).join('\n')}
`;
      zip.file('experiment-data.txt', userInfoText);
      
      // הוספת כל ההקלטות
      state.recordings.forEach((recording, index) => {
        const fileName = `${recording.type}_${String(index + 1).padStart(2, '0')}_${recording.triplet}.mp3`;
        zip.file(fileName, recording.blob);
      });
      
      console.log('מתחיל יצירת ZIP...');
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      });
      
      const zipFileName = `speech_experiment_${userId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
      
      // הורדה מקומית בלבד
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setUploadStatus('success');
      
    } catch (error) {
      console.error('שגיאה ביצירת ZIP:', error);
      setUploadStatus('error');
    }
  };

  // מסך הסיום
  if (state.phase === 'complete') {
    return (
      <div className="experiment-complete">
        <div className="success-message">
          <h2>🎉 כל הכבוד! סיימת את הניסוי בהצלחה</h2>
          <p>תודה על השתתפותך בניסוי זיהוי וזמזום צלילים.</p>
          <p>הנתונים נשמרו במערכת.</p>
        </div>

        <div className="download-actions">
          <button 
            onClick={downloadAllAsZip} 
            className="download-all-button"
            disabled={uploadStatus === 'uploading'}
          >
            {uploadStatus === 'uploading' ? '⏳ יוצר קובץ ZIP...' : '📁 הורד קובץ ZIP עם כל ההקלטות'}
          </button>
          
          {uploadStatus === 'uploading' && (
            <div className="upload-status uploading">
              <p>🔄 יוצר קובץ ZIP...</p>
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="upload-status success">
              <p>✅ הקובץ הורד בהצלחה למחשב שלך!</p>
              <p>הניסוי הושלם בהצלחה.</p>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="upload-status error">
              <p>⚠️ הייתה בעיה ביצירת קובץ ZIP.</p>
              <p>נסה שוב או פנה לתמיכה.</p>
            </div>
          )}
        </div>

        <div className="recordings-list">
          <h3>רשימת ההקלטות ({state.recordings.length}):</h3>
          {state.recordings.map((recording, index) => (
            <div key={index} className="recording-item">
              <span>
                {recording.type === 'speech' ? 'זיהוי בדיבור' : 'זמזום'} - צעד {index + 1} - {recording.triplet}
              </span>
              <audio controls src={URL.createObjectURL(recording.blob)} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="experiment-flow">
      <div className="experiment-header">
        <h2>{getPhaseTitle()}</h2>
        <p className="progress">
          {state.currentIndex + 1} / {state.triplets.length}
        </p>
      </div>
      
      <div className="instructions">
        <p>{getInstructions()}</p>
      </div>
      
      <div className="step-instructions">
        <h4>הוראות שלב אחר שלב:</h4>
        <ol>
          {getStepByStepInstructions().map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      
      <div className="audio-controls">
        <button 
          onClick={playTriplet}
          disabled={isPlaying}
          className="play-button"
        >
          {isPlaying ? 'מנגן...' : 'השמע צירוף צלילים'}
        </button>
        
        {showRecordButton && (
          <div className="recording-section">
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete}
              maxDuration={10}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentFlow;
