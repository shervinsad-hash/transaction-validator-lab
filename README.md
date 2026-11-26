# Transaction Validator Lab

A small, dependency-free Node.js script for validating synthetic transaction
records.

## Requirements

- Node.js 18 or newer

## Run

Validate the included sample:

```sh
node validate-transactions.js
```

Or pass a path to a JSON file containing an array of transactions:

```sh
node validate-transactions.js path/to/transactions.json
```

Each transaction must have a unique, non-empty `transactionId`, a positive
finite `amount`, a three-letter uppercase `currency` code, and a parseable
`timestamp`. The script prints a JSON report. It exits with status `0` when all
records are valid, `1` when records are invalid or the input cannot be read.

## Test

Run the tests with Node's built-in test runner:

```sh
node --test
```

## Sample record

```json
{
  "transactionId": "txn-1001",
  "amount": 42.5,
  "currency": "USD",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```
