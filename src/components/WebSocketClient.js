import React, { useState, useEffect } from 'react';

const WebSocketClient = ({ clientId }) => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (clientId) {
      const socket = new WebSocket(`ws://localhost:8080/?clientId=${clientId}`);

      socket.onopen = () => {
        console.log(`Connected to WebSocket server with clientId: ${clientId}`);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      socket.onclose = () => {
        console.log(`Disconnected from WebSocket server with clientId: ${clientId}`);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(socket);

      // Cleanup function to close WebSocket connection on component unmount
      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
          console.log('WebSocket connection closed');
        }
      };
    }
  }, [clientId]);

  const sendMessage = () => {
    if (ws && inputMessage) {
      try {
        const message = { name: 'printerConnectivity', isConnected: true, printerName: 'PR 23N' };
        ws.send(JSON.stringify(message));
        setInputMessage('');
        console.log('Message sent:', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.warn('WebSocket is not connected or message is empty.');
    }
  };

  return (
    <div>
      <h2>WebSocket Client</h2>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{JSON.stringify(msg)}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default WebSocketClient;
