// WebSocketClientTest.js
const WebSocket = require('ws');

const clientId = '00001-1'; // Replace with your test client ID
const ws = new WebSocket(`ws://localhost:8080/?clientId=${clientId}`);

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  ws.send(JSON.stringify({ name: 'printerConnectivity', isConnected: true, printerName: 'PR 23N' }));
});

ws.on('message', (message) => {
  console.log('Received from server:', message);
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
