type Message = () => void;

export class MessageQueue {
  private messages: Message[] = [];

  public pushMessage(msg: Message) {
    this.messages.push(msg);
  }

  public flush() {
    if (this.messages.length > 0) {
      for (let i = 0; i < this.messages.length; i++) {
        this.messages[i]();
      }
      this.messages = [];
    }
  }
}
