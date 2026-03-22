export class EventHandler {
  private handlers: Map<string, Function>;

  constructor() {
    this.handlers = new Map();
  }

  register(event: string, handler: Function) {
    this.handlers.set(event, handler);
  }

  async handle(event: string, ...args: any[]) {
    const handler = this.handlers.get(event);
    if (handler) {
      await handler(...args);
    } else {
      console.warn(`No handler registered for event: ${event}`);
    }
  }
}