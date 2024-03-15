
import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirmation-dialog">
      <div className="dialog-content">
        <p>Do you want to delete all sessions ?</p>
        <div className="button-container">
          <button style={{marginRight:'10px',border:'none',color:'white',backgroundColor:'#1a8ff0',cursor:'pointer',borderRadius:'3px'}} onClick={onConfirm}>Yes</button>
          <button style={{border:'none',backgroundColor:'#1a8ff0',color:'white',cursor:'pointer',borderRadius:'3px'}} onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
