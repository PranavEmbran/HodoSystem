import React from 'react';
import '../components/style.css';

const FormInputs = () => {
  return (
    
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" className="custom-input"  />
      </div>  
  
  );
};

export default FormInputs;
