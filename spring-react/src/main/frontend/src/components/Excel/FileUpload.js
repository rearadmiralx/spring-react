import React from 'react';

const FileUpload = ({ onFileUpload }) => {
    return (
        <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={onFileUpload} 
            className="upload-button" 
        />
    );
};

export default FileUpload;