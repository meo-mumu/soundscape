class Message {
  constructor(msg, time, mode) {
    this.msg = msg;
    // frameRate()
    this.nb_frame_remaning = time * 60;
    this.mode = mode
  }
}

class Guide {
  constructor() {
    this.queue = [];
    this.current_message = undefined;
  }

  receive_msg(msg, time, mode) {
    console.log('[guide]: ', msg);
    let message = new Message(msg, time, mode)
    if (this.current_message == undefined) { this.current_message = message }
    else { this.queue.push(message) }
  }

  draw_message() {
    if (this.current_message == undefined) { return; }
    this.display_msg(this.current_message.msg);
    this.current_message.nb_frame_remaning--;

    if (this.current_message.nb_frame_remaning <= 0) {
      if (this.current_message.mode == 'furtive') { this.current_message = this.queue.shift() }
      else if (this.current_message.mode == 'staging' && this.queue.length > 0) { this.current_message = this.queue.shift() }
    }
  }

  display_msg(msg) {
    push();
    fill(0);
    text(msg, 400, 400);
    pop();
  }

}
