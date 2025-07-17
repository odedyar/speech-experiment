import React, { useState } from 'react';
import { UserInfo } from '../types';

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    age: '',
    gender: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age) {
      console.log('Submitting user info:', formData); // לוג לבדיקה
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="user-info-form">
      <h2>פרטי משתתף</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">שם:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="הכנס שם"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="age">גיל / קבוצת גיל:</label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="לדוגמה: 25 או 20-30"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">מין (אופציונלי):</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">בחר</option>
            <option value="male">גבר</option>
            <option value="female">אישה</option>
            <option value="other">אחר</option>
          </select>
        </div>
        
        <button type="submit" className="submit-button">
          התחל ניסוי
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;
