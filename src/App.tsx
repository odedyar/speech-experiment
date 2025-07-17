import React, { useState } from 'react';
import './App.css';
import UserInfoForm from './components/UserInfoForm';
import ExperimentFlow from './components/ExperimentFlow';
import { UserInfo } from './types';

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState<string>('');

  const handleUserInfoSubmit = (info: UserInfo) => {
    // יצירת מזהה אוטומטי
    const newUserId = `u${String(Date.now()).slice(-3).padStart(3, '0')}`;
    setUserId(newUserId);
    setUserInfo(info);
  };

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
