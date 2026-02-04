# @versa/pdfgen

## 1.14.6

### Patch Changes

- fix: tax rates present with sensible default precision"

## 1.14.5

### Patch Changes

- fixed tax rate rendering bug; ux improvement for receipt updates
- Updated dependencies
  - @versa/belt@1.14.5

## 1.14.4

### Patch Changes

- patch update to 2.1.1
- Updated dependencies
  - @versa/schema@2.1.1
  - @versa/belt@1.14.4

## 1.14.3

### Patch Changes

- look up timezone based on lat/lon in places
- Updated dependencies
  - @versa/belt@1.14.3

## 1.14.2

### Patch Changes

- fix: currency support for all browser-supported localized currencies
- Updated dependencies
  - @versa/belt@1.14.2

## 1.14.1

### Patch Changes

- apply patch for better time handling in service itemizations
- Updated dependencies
  - @versa/belt@1.14.1

## 1.14.0

### Minor Changes

- basic support for schema version 2.1.0; including service itemizations

### Patch Changes

- Updated dependencies
  - @versa/schema@2.1.0
  - @versa/belt@1.14.0

## 1.13.8

### Patch Changes

- more defensiveness around missing currency

## 1.13.7

### Patch Changes

- Updated dependencies
  - @versa/belt@1.13.4

## 1.13.6

### Patch Changes

- fix: formatTransactionValue breaking error on null currency codes
- Updated dependencies
  - @versa/belt@1.13.3

## 1.13.5

### Patch Changes

- fix: empty-space bug with one_time subscriptions

## 1.13.4

### Patch Changes

- Fixed bugs with ecommerce shipment status display; flight itinerary segmentation
- Updated dependencies
  - @versa/belt@1.13.2

## 1.13.3

### Patch Changes

- Fix metadata display and product urls

## 1.13.2

### Patch Changes

- Display logic fixes for third parties

## 1.13.1

### Patch Changes

- Updated dependencies
  - @versa/belt@1.13.1

## 1.13.0

### Minor Changes

- Update for public release of 2.0.0

### Patch Changes

- Updated dependencies
  - @versa/schema@2.0.0
  - @versa/belt@1.13.0

## 1.12.6

### Patch Changes

- fix null-handling of adjustments and taxes; update receipt example
- Updated dependencies
  - @versa/belt@1.12.5

## 1.12.5

### Patch Changes

- patch versions with backwards compatible support for 2.0.0-rc3
- Updated dependencies
  - @versa/belt@1.12.4

## 1.12.4

### Patch Changes

- Patch updates for schema version 2.0.0-rc2
- Updated dependencies
  - @versa/schema@1.12.1
  - @versa/belt@1.12.3

## 1.12.3

### Patch Changes

- fix display bugs with 2.0.0 receipts
- Updated dependencies
  - @versa/belt@1.12.2

## 1.12.2

### Patch Changes

- Bugfix: improperly embedded expression in payment method literal

## 1.12.1

### Patch Changes

- Bugfix: correctly organize passengers including metadata
- Updated dependencies
  - @versa/belt@1.12.1

## 1.12.0

### Minor Changes

- Preliminary Support for Versa Schema Version 2.0 (rc1)

### Patch Changes

- Updated dependencies
  - @versa/belt@1.12.0
  - @versa/schema@1.12.0

## 1.11.2

### Patch Changes

- More reliable timezone support across pdf and react rendering
- Updated dependencies
  - @versa/belt@1.11.1

## 1.11.1

### Patch Changes

- Patch vulnerable dependencies

## 1.11.0

### Minor Changes

- Bump all downstream package versions to 1.11.0

### Patch Changes

- Updated dependencies
  - @versa/belt@1.11.0

## 1.10.1

### Patch Changes

- Updated dependencies
  - @versa/schema@1.11.0
  - @versa/belt@1.10.1

## 1.10.0

### Minor Changes

- Update to schema_version 1.10.0

### Patch Changes

- Updated dependencies
  - @versa/schema@1.10.0
  - @versa/belt@1.10.0

## 1.9.0

### Minor Changes

- Update to schema version 1.9, supporting taxes and fare on the flight ticket level

### Patch Changes

- Updated dependencies
  - @versa/schema@1.9.0
  - @versa/belt@1.9.0

## 1.8.9

### Patch Changes

- Patch bug where pdf generation short circuits on an image fetch error, e.g. CSP violation
