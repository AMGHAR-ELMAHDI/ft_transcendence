import React, { useEffect, useState } from 'react';

interface OnlineStatusProps {
    token: string | null;
    type: number;
}

interface Message {
    type: string;
    data: any;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ token, type }) => {
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:2500/ws/status/${token}/${type}`);

        socket.onopen = () => {
            setConnectionStatus('Connected');
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log('WebSocket message received:', message);
        };

        socket.onclose = (event) => {
            setConnectionStatus('Disconnected');
            console.log('WebSocket closed:', event);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, [token]);

    return (
        <div>
            <h1>WebSocket Connection Status: {connectionStatus}</h1>
            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{JSON.stringify(msg)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OnlineStatus;