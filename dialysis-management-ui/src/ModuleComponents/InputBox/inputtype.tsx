import React from 'react';
import '../components/style.css';

const FormInputType = () => {
  return (
    
    <div className="form-group">
        <label htmlFor="dropdown">Select an option:</label>
        <select id="dropdown" name="dropdown" className="custom-select">
          <option value="">Select</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
 
  );
};
export default FormInputType;