import React from 'react';
import '../components/style.css'; 

const AddressInput: React.FC = () => {
  return (
  
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          name="address"
          className="custom-textarea"
        ></textarea>
      </div>
    
  );
};

export default AddressInput;
