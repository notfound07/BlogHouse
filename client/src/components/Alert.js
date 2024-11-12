import React, { useEffect } from 'react';
import './Alert.css';

function Alert({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
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
