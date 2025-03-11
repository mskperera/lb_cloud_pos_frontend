class WebSocketClient {
    constructor(clientId) {
      this.clientId = clientId;
      this.ws = null;
    }
  
    // Initialize WebSocket connection
    connect() {
      this.ws = new WebSocket(`ws://localhost:8080/?clientId=${this.clientId}`);
  
      this.ws.onopen = () => {
        console.log(`Connected to WebSocket server with clientId: ${this.clientId}`);
      };
  
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
      };
  
      this.ws.onclose = () => {
        console.log(`Disconnected from WebSocket server with clientId: ${this.clientId}`);
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    // Send a message via WebSocket
    sendMessage(message) {
      if (this.ws && message) {
        this.ws.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not connected or message is empty.');
      }
    }
  
    // Close WebSocket connection
    disconnect() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }