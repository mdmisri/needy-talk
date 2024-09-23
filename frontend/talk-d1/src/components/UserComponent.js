import React, { useEffect } from 'react';
import socket from './socket';

const UserComponent = ({ username }) => {
    useEffect(() => {
        // Emit userOnline event when the component mounts
        socket.emit('userOnline', username);

        // Cleanup function to emit userOffline event when the component unmounts
        return () => {
            socket.emit('userOffline', username);
        };
    }, [username]);

    return (
        <div>
            <h1>Welcome, {username}</h1>
            {/* Other UI elements for the user */}
        </div>
    );
};

export default UserComponent;
