import React, { useState, useEffect } from 'react';
import './App.css';
import UserInfoForm from './components/UserInfoForm';
import ExperimentFlow from './components/ExperimentFlow';
import { UserInfo } from './types';

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [permissionState, setPermissionState] = useState<'checking' | 'granted' | 'denied' | 'prompt'>('checking');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionState('denied');
        return;
      }

      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'granted') {
          setPermissionState('granted');
          return;
        } else if (permission.state === 'denied') {
          setPermissionState('denied');
          return;
        }
      }

      setPermissionState('prompt');
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setPermissionState('prompt');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionState('denied');
    }
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    console.log('User info submitted:', info);
    const newUserId = `u${String(Date.now()).slice(-3).padStart(3, '0')}`;
    setUserId(newUserId);
    setUserInfo(info);
  };

  if (permissionState === 'checking') {
    return (
      <div className="App">
        <div className="container">
          <h1>ניסוי זיהוי וזמזום צלילים</h1>
          <div className="permission-card">
            <h3>בודק הרשאות מיקרופון...</h3>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (permissionState === 'prompt') {
    return (
      <div className="App">
        <div className="container">
          <h1>ניסוי זיהוי וזמזום צלילים</h1>
          <div className="permission-card">
            <h3>🎤 נדרשת הרשאה למיקרופון</h3>
            <p>כדי להשתתף בניסוי, נדרש לאפשר גישה למיקרופון.</p>
            <button 
              onClick={requestMicrophonePermission}
              className="permission-button"
            >
              לחץ כאן לאישור גישה למיקרופון
            </button>
            <p className="note">יופיע חלון קופץ - לחץ "אפשר" או "Allow"</p>
          </div>
        </div>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className="App">
        <div className="container">
          <h1>ניסוי זיהוי וזמזום צלילים</h1>
          <div className="permission-card">
            <div className="alert">
              <h4>⚠️ הגישה למיקרופון נדחתה</h4>
              <p>כדי להמשיך בניסוי, יש לאפשר גישה למיקרופון.</p>
              <p><strong>הוראות בסיסיות:</strong></p>
              <ul style={{textAlign: 'right', paddingRight: '20px'}}>
                <li>לחץ על האייקון 🔒 או 🎤 בשורת הכתובת</li>
                <li>בחר "אפשר" עבור מיקרופון</li>
                <li>רענן את הדף</li>
              </ul>
            </div>
            
            <div className="button-group">
              <button 
                onClick={checkMicrophonePermission}
                className="retry-button"
              >
                נסה שוב
              </button>
              
              <button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="instructions-toggle"
              >
                {showInstructions ? 'הסתר הוראות מפורטות' : 'הצג הוראות מפורטות'}
              </button>
            </div>

            {showInstructions && (
              <div className="detailed-instructions">
                <h4>הוראות מפורטות לפי דפדפן:</h4>
                
                <div className="browser-instruction">
                  <h5>🌐 כרום (Chrome):</h5>
                  <ol>
                    <li>לחץ על האייקון 🔒 או 🎤 בשורת הכתובת</li>
                    <li>בחר "הגדרות אתר" או "Site settings"</li>
                    <li>מצא "מיקרופון" ושנה ל"אפשר"</li>
                    <li>רענן את הדף</li>
                  </ol>
                </div>

                <div className="browser-instruction">
                  <h5>🦊 פיירפוקס (Firefox):</h5>
                  <ol>
                    <li>לחץ על האייקון 🎤 בשורת הכתובת</li>
                    <li>בחר "אפשר" מהתפריט</li>
                    <li>אם זה לא מופיע, לחץ F5 לרענון</li>
                  </ol>
                </div>

                <div className="browser-instruction">
                  <h5>🌊 אדג' (Edge):</h5>
                  <ol>
                    <li>לחץ על האייקון 🔒 בשורת הכתובת</li>
                    <li>בחר "הרשאות לאתר זה"</li>
                    <li>שנה "מיקרופון" ל"אפשר"</li>
                    <li>רענן את הדף</li>
                  </ol>
                </div>

                <div className="browser-instruction">
                  <h5>📱 נייד (Chrome/Safari):</h5>
                  <ol>
                    <li>לחץ על האייקון ℹ️ או 🔒 בשורת הכתובת</li>
                    <li>מצא "מיקרופון" ושנה ל"אפשר"</li>
                    <li>רענן את הדף</li>
                    <li>אם זה לא עוזר, נסה לסגור ולפתוח מחדש את הדפדפן</li>
                  </ol>
                </div>

                <div className="general-tips">
                  <h5>💡 טיפים נוספים:</h5>
                  <ul>
                    <li>וודא שהמיקרופון מחובר ופועל</li>
                    <li>בדוק שאף אפליקציה אחרת לא משתמשת במיקרופון</li>
                    <li>נסה לסגור אפליקציות אחרות (זום, סקייפ וכו')</li>
                    <li>אם כלום לא עוזר, נסה דפדפן אחר</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <h1>ניסוי זיהוי וזמזום צלילים</h1>
        {!userInfo ? (
          <UserInfoForm onSubmit={handleUserInfoSubmit} />
        ) : (
          <ExperimentFlow userInfo={userInfo} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default App;
