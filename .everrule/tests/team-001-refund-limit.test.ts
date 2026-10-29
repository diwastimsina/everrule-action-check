// ER-TEAM-001 (team-written): a refund can never exceed the original charge.
// Not derived from an incident, so there is no failing commit; the contract records
// the team's basis instead and is never shown as proven against a failure.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../../src/payments/charge";
import { Refunds } from "../../src/payments/refund";

const charge = (amount: number) => new Ledger().createCharge("key-team-001", amount);

test("a full refund is allowed and leaves nothing to refund", () => {
  assert.equal(new Refunds().refund(charge(5000), 5000), 0);
});

test("a single refund above the charge is refused", () => {
  assert.throws(() => new Refunds().refund(charge(5000), 5001), RangeError);
});

test("partial refunds that add up to more than the charge are refused", () => {
  const refunds = new Refunds();
  const c = charge(5000);
  assert.equal(refunds.refund(c, 3000), 2000);
  assert.throws(() => refunds.refund(c, 2001), RangeError);
  assert.equal(refunds.refund(c, 2000), 0);
});
