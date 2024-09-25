import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ options, position, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        // Function to close the menu on outside click
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };

        // Listen for left or right clicks outside the menu
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            className="context-menu"
            style={{ position: 'absolute', top: position.y, left: position.x }}
            ref={menuRef}
        >
            {options.map((option, index) => (
                <div 
                    key={index} 
                    onClick={option.action} 
                    className="context-menu-item"
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
};

export default ContextMenu;
