import React from 'react';

const SaveButton = ({ onSave }) => {
    return (
        <button onClick={onSave} className="save-button">
            Save and Download
        </button>
    );
};

export default SaveButton;