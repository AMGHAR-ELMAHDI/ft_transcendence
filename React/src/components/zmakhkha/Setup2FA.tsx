import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthToken } from "../Utils/setAuthToken";



function Setup2FA() {
    const [secret, setSecret] = useState('');

    useEffect(() => {
        
        async function fetchSecret() {
            try {
                const response = await axios.get('http://localhost:2500/setup-2fa/');
                setSecret(response.data.secret);
                console.log(response.data.friends);
              } catch (error) {
                console.log(error);
              }
        }
        fetchSecret();
    }, []);

    return (
        <div>
            <h1>Setup Two-Factor Authentication</h1>
            <p>Scan this QR code with your authentication app:</p>
            <img src={secret} alt="QR Code"/>
            <p>Or enter this key manually: {secret}</p>
        </div>
    );
}

export default Setup2FA;
