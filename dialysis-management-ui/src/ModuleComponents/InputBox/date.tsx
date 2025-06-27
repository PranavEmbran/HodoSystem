import React from 'react';
import '../components/style.css';

const FormDateInput = () => {
  return (
    
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" className="custom-date" />
      </div>
  
  );
};
export default FormDateInput;