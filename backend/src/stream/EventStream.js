/**
 * MIRROR - Event Stream Manager
 * Buffers raw observation events, broadcasts to connected clients,
 * and maintains sequence history.
 */

export class EventStream {
  constructor(maxBufferSize = 100) {
    this.buffer = [];
    this.maxBufferSize = maxBufferSize;
    this.subscribers = new Set();
  }

  push(event) {
    const enrichedEvent = {
      ...event,
      receivedAt: new Date().toISOString()
    };
    this.buffer.push(enrichedEvent);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }
    this.notifySubscribers(enrichedEvent);
    return enrichedEvent;
  }

  getRecentEvents(limit = 20) {
    return this.buffer.slice(-limit);
  }

  getAllEvents() {
    return [...this.buffer];
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(event) {
    for (const callback of this.subscribers) {
      try {
        callback(event);
      } catch (err) {
        console.error('EventStream notification error:', err);
      }
    }
  }

  clear() {
    this.buffer = [];
  }
}

export const eventStream = new EventStream();
