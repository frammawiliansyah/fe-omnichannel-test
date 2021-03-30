class OpResult {
  constructor() {
    this.status = undefined;
    this.data = undefined;
    this.message = undefined;
  }
  static success(data) {
    let op = new OpResult();
    op.status = true;
    op.message = data.message;
    if (data) {
      op.data = data;
    }
    return op;
  }

  static failed(message) {
    let op = new OpResult();
    op.status = false;
    if (message) {
      op.message = message;
    }
    return op;
  }
}

export { OpResult };
