// Alert.js
import React, { useEffect } from 'react';
import './Alert.css';

function Alert({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 15000); // auto-close after 15 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`alert alert-${type}`}>
            {message}
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
}

export default Alert;
