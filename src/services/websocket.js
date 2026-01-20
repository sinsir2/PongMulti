class WebSocketService {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.handlers = new Map();
    this.messageQueue = []; // Queue for messages sent before connection opens

    this.ws.onopen = () => {
      console.log('WebSocket connected');

      // Flush queued messages
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.ws.send(JSON.stringify(msg));
        console.log('Sent queued message:', msg.type);
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const handler = this.handlers.get(data.type);
      if (handler) {
        handler(data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  on(messageType, handler) {
    this.handlers.set(messageType, handler);
  }

  send(type, data) {
    const message = { type, ...data };

    if (this.ws.readyState === WebSocket.OPEN) {
      // Connection is open, send immediately
      this.ws.send(JSON.stringify(message));
    } else {
      // Connection not ready, queue the message
      console.log('Queueing message (connection not ready):', type);
      this.messageQueue.push(message);
    }
  }
}

export default WebSocketService;
