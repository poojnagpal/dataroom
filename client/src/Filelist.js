// FileList.js
import React from 'react';
import './FileList.css'; // Import your CSS file for styling

const FileList = ({ files }) => {
  return (
    <div className="file-list">
      <h2>My Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} className="file-item">
            <span className={`file-icon ${file.type === 'folder' ? 'folder-icon' : 'file-icon'}`}>
              {file.type === 'folder' ? '📁' : '📄'} {/* Replace with actual icons */}
            </span>
            <span className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-members">{file.members}</span>
            </span>
            {file.type === 'file' && <span className="file-modified">{file.modified}</span>}
            <span className="file-options">...</span> {/* Placeholder for future options */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
