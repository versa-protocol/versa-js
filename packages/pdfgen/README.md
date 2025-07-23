# Versa PDF Generator

This package supports generating a PDF document from Versa receipt data.

## Testing

This package uses Jest for unit testing and the [Ava](https://github.com/avajs/ava) test framework for integration & regression testing

### Commands

- `pnpm test` Run all test suites
- `pnpm test:ava` Run Ava test suite
- `pnpm test:ava --match "canceled receipt"` Instructs Ava to run a specific test

## Troubleshooting & Warnings

- In some cases, `jspdf-autotable` will log a warning like this: `"Of the table content, 8 units width could not fit page"`. This is a non-critical warning; `jspdf-autotable` automatically adjusts by wrapping text, scaling, or breaking content across pages
