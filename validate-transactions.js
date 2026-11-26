const fs = require("node:fs");
const path = require("node:path");

function validateTransactions(transactions) {
  if (!Array.isArray(transactions)) {
    throw new TypeError("Input must be a JSON array of transactions");
  }

  const seenIds = new Set();
  const errors = [];

  transactions.forEach((transaction, index) => {
    const recordErrors = [];
    const isRecord =
      transaction !== null &&
      typeof transaction === "object" &&
      !Array.isArray(transaction);

    if (!isRecord) {
      errors.push({
        index,
        transactionId: null,
        errors: ["Transaction must be an object"],
      });
      return;
    }

    const { transactionId, amount, currency, timestamp } = transaction;

    if (typeof transactionId !== "string" || transactionId.trim() === "") {
      recordErrors.push("transactionId must be a non-empty string");
    } else if (seenIds.has(transactionId)) {
      recordErrors.push("transactionId must be unique");
    } else {
      seenIds.add(transactionId);
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      recordErrors.push("amount must be a positive finite number");
    }

    if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
      recordErrors.push("currency must be a three-letter uppercase code");
    }

    if (
      typeof timestamp !== "string" ||
      timestamp.trim() === "" ||
      !Number.isFinite(Date.parse(timestamp))
    ) {
      recordErrors.push("timestamp must be a parseable date string");
    }

    if (recordErrors.length > 0) {
      errors.push({ index, transactionId: transactionId ?? null, errors: recordErrors });
    }
  });

  return {
    valid: errors.length === 0,
    total: transactions.length,
    errors,
  };
}

if (require.main === module) {
  const inputPath = path.resolve(
    process.argv[2] || path.join(__dirname, "sample-transactions.json"),
  );

  try {
    const transactions = JSON.parse(fs.readFileSync(inputPath, "utf8"));
    const report = validateTransactions(transactions);
    console.log(JSON.stringify(report, null, 2));
    if (!report.valid) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`Unable to validate transactions: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { validateTransactions };
