// DataRoom.js
import React, { useState } from 'react';
import axios from 'axios';
import './Dataroom.css'; // Make sure to create this CSS file

function DataRoom() {
  const [roomName, setRoomName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [renamingItemId, setRenamingItemId] = useState(null);
  const [renamingValue, setRenamingValue] = useState('');



  const [items, setItems] = useState([
    // Example structure
    { id: 'folder2', name: 'Lawsuits', type: 'folder', isOpen: false, children: [] },
    { id: 'folder1', name: 'Folder 1', type: 'folder', isOpen: false, children: [] },
    // Add more files and folders as needed
  ]);
    const [type, setType] = useState('')
  const [overFolder, setOverFolder] = useState(null);
  const [currentDropTarget, setCurrentDropTarget] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [structure, setStructure] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState(null)
  const [showOptions, setShowOptions] = useState(null)




  const handleContextMenuAction = (action, itemId) => {
    if (action === 'delete') {
      // Logic to delete the item
      setItems(items.filter(item => item.id !== itemId));
    } else if (action === 'rename') {
      // Logic to rename the item
      const newName = prompt('Enter the new name:', '');
      if (newName) {
        setItems(items.map(item =>
          item.id === itemId ? { ...item, name: newName } : item
        ));
      }
    }
    setContextMenu(null); // Hide context menu after action
  };

  const handleRightClick = (e, itemId) => {
    e.preventDefault();
    setContextMenu({
      itemId: itemId,
      position: { top: e.clientY, left: e.clientX }
    });
  };

  const handleDelete = (itemId) => {
    // Update the items state to filter out the deleted item
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setShowOptions(null); // Close the options menu
  };

  const handleEdit = (itemId) => {
    // Prompt the user for a new name
    const newName = window.prompt('Enter the new name:', '');
    if (newName && newName.trim() !== '') {
      setItems(prevItems =>
        prevItems.map(item => (item.id === itemId ? { ...item, name: newName } : item))
      );
    }
    setShowOptions(null); // Close the options menu
  };

  const handleView = (fileName) => {
    console.log('file name', fileName)

    axios.get(`/view-file?fileName=${encodeURIComponent(fileName)}`)
      .then(response => {
        const fileUrl = response.data.url;
        window.open(fileUrl, '_blank'); // Open the file URL in a new tab
      })
      .catch(error => {
        console.error('Error fetching file URL', error);
      });
  };

  
  const handleDragEnd = () => {
    // Reset the dragging state when the drag ends
    setDragging(false);
  };



  const handleDragEnter = (e, folderName) => {
    e.preventDefault();
    setCurrentDropTarget(folderName); // Set the current drop target to the folder being dragged over
  };

  const handleDragLeave = (e, folderName) => {
    e.preventDefault();
    // Only unset the current drop target if leaving the current target (not on child elements)
    if (currentDropTarget === folderName) {
      setCurrentDropTarget(null);
    }
  };

  const handleDrop = (e, folder) => {
    e.preventDefault(); // Prevent default to allow the drop
    const itemData = e.dataTransfer.getData('application/json');
    const draggedItem = JSON.parse(itemData);
  
    // Prevent file from being dropped into itself or a non-folder
    if (draggedItem.id === folder.id || folder.type !== 'folder') {
      return;
    }
  
    // Update the items, moving the draggedItem into the folder
    setItems((prevItems) => {
      // Remove the item from its current position
      const withoutDraggedItem = prevItems.filter(item => item.id !== draggedItem.id);
      // Add the item as a child of the folder
      const updatedItems = withoutDraggedItem.map(item => {
        if (item.id === folder.id) {
          return {
            ...item,
            children: [...item.children, { ...draggedItem, parentId: folder.id }]
          };
        }
        return item;
      });
      return updatedItems;
    });
  };


  const handleOptionsClick = (e, itemId) => {
    e.stopPropagation();
    e.preventDefault();
    
    
    const optionsIcon = e.currentTarget;
    const rect = optionsIcon.getBoundingClientRect();
    setShowOptions(itemId); // Set the item to show options for
    setContextMenu({
      itemId: itemId,
      position: { top: rect.bottom + window.scrollY, left: rect.right + window.scrollX }
    });
  };
  

  const handleRenameClick = (itemId) => {
    console.log('Attempting to rename item with id:', itemId);
    const currentItem = items.find(item => item.id === itemId);
    if (currentItem) {
      setRenamingItemId(itemId);
      setRenamingValue(currentItem.name);
      setContextMenu(null);
    }
  };

  const handleSaveNewName = (e, itemId) => {
    e.preventDefault();
    const newName = renamingValue.trim();
    if (newName) {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, name: newName } : item))
      );
      setRenamingItemId(null);
    }
  };

  const displayContextMenu = (e, itemId) => {
    e.preventDefault();
    setContextMenu({
      itemId: itemId,
      position: { x: e.clientX, y: e.clientY },
    });
  };
  
  
  
  const displayItem = (item) => {
    const isRenaming = renamingItemId === item.id;
  
    const handleDragStart = (e, item) => {
      // We'll use JSON.stringify to store the item's data
      e.dataTransfer.setData('application/json', JSON.stringify(item));
      e.dataTransfer.effectAllowed = 'move';
    };
  
    const handleDragOver = (e, folder) => {
      // If we're dragging over a folder, we need to prevent the default behavior
      // to allow for a drop event
      if (folder.type === 'folder') {
        e.preventDefault();
      }
    };
  
    return (
      <li
      key={item.id}
      draggable={item.type === 'file'}
      onDragStart={(e) => handleDragStart(e, item)}
      onDragOver={(e) => handleDragOver(e, item)}
      onDrop={(e) => handleDrop(e, item)}
      onDragEnd={handleDragEnd}
      className={`file-item ${isRenaming ? 'renaming' : ''}`}
    >
      
      {item.type === 'folder' ? (
        <>
          <span  className="toggle-icon" onClick={() => toggleFolder(item.id)} >{item.isOpen ? '▼' : '►'}</span>
          <span className="file-icon" onClick={toggleFolder}>📁</span>
        </>
      ) : (
        <span className="file-icon">{item.type === 'folder' ? '📁' : '📄'}</span>
      )}
        {isRenaming ? (
          <input
            className="inline-rename-input"
            value={renamingValue}
            onChange={(e) => setRenamingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Pass the event object and other parameters
                handleSaveNewName(e, item.id, renamingValue);
              }
            }}
            onBlur={(e) => {
              // Pass the event object and other parameters
              handleSaveNewName(e, item.id, renamingValue);
            }}
            autoFocus
          />
        ) : (
          <span className="file-name" onDoubleClick={() => handleRenameClick(item.id)}>
            {item.name}
          </span>
        )}
  
        <span className="options-icon" onClick={(e) => handleOptionsClick(e, item.id)}>⋮</span>
  
              {contextMenu && contextMenu.itemId === item.id && (
        <ul className="context-menu" >
          <li onClick={() => handleRenameClick(item.id)}>Rename</li>
          <li onClick={() => handleDelete(item.id)}>Delete</li>
          <li onClick={() => handleView(item.name)}>View</li>


        </ul>
)}
{item.type === 'folder' && item.isOpen && (
        <ul className="folder-contents">
          {item.children && item.children.map(child => (
            <li key={child.id} className="file-item">
              <span className="file-icon">📄</span>
              <span className="file-name">{child.name}</span>
              {/* Include rename, delete, etc. for child items if needed */}
            </li>
          ))}
        </ul>
      )}
      </li>
    );
  };
  
  
  
  const renderItemstwo = (parentId = null) => {
    return (
      <ul>
        {items.filter(item => item.parentId === parentId).map(displayItem)}
      </ul>
    );
  };
  
  
  

  // Recursive function to render items
  const renderItems = (parentId = null) => {
  return (
    <ul>
      {items
        .filter(item => item.parentId === parentId)
        .map(item => (
          <li key={item.id} className={item.type}>
            <span className="item-icon" onClick={() => item.type === 'folder' && toggleFolder(item.id)}>

              {item.type === 'folder' ? (item.isOpen ? '▼' : '►') : '📄'}
            </span>
            {' '}
            <span className="item-name">
              {item.name}
            </span>
            <span className="options-icon" onClick={(e) => handleOptionsClick(e, item.id, 'options')}> ⋮ </span>
            {showOptions === item.id && (
              <ul className="context-menu">
                <li onClick={() => handleEdit(item.id)}>Edit</li>
                <li onClick={() => handleDelete(item.id)}>Delete</li>
              </ul>
            )}
            {item.type === 'folder' && item.isOpen && renderItems(item.id)}
          </li>
        ))}
    </ul>
  );
};


  // Function to toggle a folder open or closed
  const toggleFolder = (folderId) => {
    setItems(items => items.map(item => {
      if (item.id === folderId && item.type === 'folder') {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    }));
  };
  
  

  const createFolder = (parentId = null) => {
    if (!newFolderName.trim()) {
      setUploadError('Please enter a folder name.');
      return;
    }
  
    const newFolder = {
      id: `folder-${Date.now()}`, // Generate a unique ID for the folder
      name: newFolderName,
      type: 'folder',
      parentId: parentId, // Set the parent ID
      isOpen: false,
      children: [] // Initialize an empty array for children
    };
  
    setItems([...items, newFolder]);
    setNewFolderName(''); // Reset the input field
    setUploadError(''); // Clear any previous errors
  };
  


  const uploadFile = () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setUploadSuccess(true);
      setUploadError('');
      setItems([...items, { name: selectedFile.name, type: 'file', modified: 'Just now', members: 'Only you' }]);
      console.log('File uploaded successfully', response.data);
    })
    .catch(error => {
      setUploadSuccess(false);
      setUploadError('Error uploading file. Please try again.');
      console.error('Error uploading file', error);
    });
  };

  return (
<div className="data-room" onClick={() => setContextMenu(null)}>
      <input 
        type="file" 
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
            <button onClick={uploadFile}>Upload File</button>


      <input 
              type="text" 
              placeholder="Enter New Folder Name" 
              value={newFolderName} 
              onChange={(e) => setNewFolderName(e.target.value)}
            />
      <button onClick={createFolder}>Create Folder</button>
      <div className="file-list">
        <h2>My Files</h2>
        {/* {renderItems()} */}
      </div>
      {uploadSuccess && <div className="upload-success">Your file was uploaded successfully!</div>}
      {uploadError && <div className="upload-error">{uploadError}</div>}
        <ul className="file-list">{items.map(displayItem)}</ul>


    </div>
  
  );
}

export default DataRoom;
