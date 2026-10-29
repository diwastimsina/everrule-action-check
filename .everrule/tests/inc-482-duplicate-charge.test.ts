// ER-INC-482: a retry must never create a second charge for the same idempotency key.
// Fails on the revision that shipped INC-482 (no idempotency map); passes on the fix.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../../src/payments/charge";

test("immediate retry with the same key posts exactly one charge", () => {
  const ledger = new Ledger();
  ledger.createCharge("key-482", 7800);
  ledger.createCharge("key-482", 7800);
  assert.equal(ledger.posted().length, 1);
});

test("same key with a changed payload still posts exactly one charge", () => {
  const ledger = new Ledger();
  ledger.createCharge("key-482", 7800);
  ledger.createCharge("key-482", 7900);
  assert.equal(ledger.posted().length, 1);
});

test("different keys post different charges", () => {
  const ledger = new Ledger();
  ledger.createCharge("key-a", 100);
  ledger.createCharge("key-b", 100);
  assert.equal(ledger.posted().length, 2);
});
