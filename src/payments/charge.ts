// Synthetic payments module for the EverRule Prevent fixture. Not a real system (comment edit).
// After INC-482 ("retry charged the customer twice"), createCharge became
// idempotent: the same idempotency key never posts a second charge.
export interface Charge { id: string; idempotencyKey: string; amount: number }

export class Ledger {
  private readonly posted_: Charge[] = [];
  private readonly byKey = new Map<string, Charge>();

  createCharge(idempotencyKey: string, amount: number): Charge {
    const existing = this.byKey.get(idempotencyKey);
    if (existing) return existing; // the fix for INC-482
    const charge = { id: `ch_${this.posted_.length + 1}`, idempotencyKey, amount };
    this.posted_.push(charge);
    this.byKey.set(idempotencyKey, charge);
    return charge;
  }

  posted(): Charge[] {
    return [...this.posted_];
  }
}
