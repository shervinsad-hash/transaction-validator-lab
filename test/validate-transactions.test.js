const test = require("node:test");
const assert = require("node:assert/strict");
const { validateTransactions } = require("../validate-transactions");

const validTransaction = {
  transactionId: "txn-1",
  amount: 25.5,
  currency: "USD",
  timestamp: "2026-01-15T10:30:00.000Z",
};

test("accepts a valid transaction", () => {
  const report = validateTransactions([validTransaction]);

  assert.equal(report.valid, true);
  assert.equal(report.total, 1);
  assert.deepEqual(report.errors, []);
});

test("reports invalid transaction fields", () => {
  const report = validateTransactions([
    {
      ...validTransaction,
      transactionId: " ",
      amount: 0,
      currency: "usd",
      timestamp: "not-a-date",
    },
  ]);

  assert.equal(report.valid, false);
  assert.equal(report.errors.length, 1);
  assert.equal(report.errors[0].errors.length, 4);
});

test("rejects duplicate transaction IDs", () => {
  const report = validateTransactions([
    validTransaction,
    { ...validTransaction, amount: 12 },
  ]);

  assert.equal(report.valid, false);
  assert.deepEqual(report.errors[0].errors, ["transactionId must be unique"]);
});
