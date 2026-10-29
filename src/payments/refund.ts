// Synthetic refunds for the EverRule Prevent fixture. Not a real system.
// ER-TEAM-001 (team-written, no incident behind it): a refund can never exceed the
// original charge, including several partial refunds added together.
import type { Charge } from "./charge";

export class Refunds {
  private readonly refunded = new Map<string, number>();

  /** Refunds part or all of a charge; returns what is left to refund. */
  refund(charge: Charge, amount: number): number {
    if (!Number.isInteger(amount) || amount <= 0) throw new RangeError("a refund is a positive whole number of cents");
    const total = (this.refunded.get(charge.id) ?? 0) + amount;
    if (total > charge.amount) throw new RangeError(`refunds for ${charge.id} would exceed the original charge`);
    this.refunded.set(charge.id, total);
    return charge.amount - total;
  }
}
