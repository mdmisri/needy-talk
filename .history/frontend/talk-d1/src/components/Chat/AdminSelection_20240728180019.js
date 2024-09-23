import React from 'react';
import './styles/AdminSelection.css'; // Create this CSS file for styling

const AdminSelection = ({ onSelectAdmin }) => {
    return (
        <div className="admin-selection-container">
            <div className="card" onClick={() => onSelectAdmin('srk')}>
              
                <h3>Male Admin (srk)</h3>
            </div>
            <div className="card" onClick={() => onSelectAdmin('suhana')}>
                <h3>Female Admin (suhana)</h3>
            </div>
        </div>
    );
};

export default AdminSelection;
