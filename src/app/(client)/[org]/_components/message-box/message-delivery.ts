export type DeliveryStatus = "sending" | "failed" | "sent";

export type DeliveryAttempt = {
  scope: string;
  id: string;
  html: string;
  preview?: string;
  attachmentIds: string[];
  send: (retry: boolean) => Promise<boolean>;
  status: DeliveryStatus;
};

/** One request per composer; retries retain the original payload and destination. */
export class MessageDelivery {
  private attempts = new Map<string, DeliveryAttempt>();
  private pending = false;

  get(scope: string) {
    return this.attempts.get(scope);
  }

  get busy() {
    return this.pending;
  }

  async deliver(attempt: DeliveryAttempt, retry = false): Promise<boolean> {
    if (this.pending) return false;
    if (
      retry &&
      (this.get(attempt.scope) !== attempt || attempt.status !== "failed")
    ) {
      return false;
    }
    // Set the lock before invoking the callback, rather than waiting for a render.
    this.pending = true;
    this.attempts.set(attempt.scope, attempt);
    attempt.status = "sending";
    try {
      const sent = (await attempt.send(retry)) === true;
      attempt.status = sent ? "sent" : "failed";
      if (sent) this.attempts.delete(attempt.scope);
      return sent;
    } catch {
      attempt.status = "failed";
      return false;
    } finally {
      this.pending = false;
    }
  }
}
