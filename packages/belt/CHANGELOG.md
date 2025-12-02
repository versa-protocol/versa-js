# @versa/belt

## 1.14.4

### Patch Changes

- Updated dependencies
  - @versa/schema@2.1.1

## 1.14.3

### Patch Changes

- look up timezone based on lat/lon in places

## 1.14.2

### Patch Changes

- fix: currency support for all browser-supported localized currencies

## 1.14.1

### Patch Changes

- apply patch for better time handling in service itemizations

## 1.14.0

### Minor Changes

- basic support for schema version 2.1.0; including service itemizations

### Patch Changes

- Updated dependencies
  - @versa/schema@2.1.0

## 1.13.4

### Patch Changes

- fix: error on double-booked flight segments e.g. multiple seats booked for one passenger"

## 1.13.3

### Patch Changes

- fix: formatTransactionValue breaking error on null currency codes

## 1.13.2

### Patch Changes

- Fixed bugs with ecommerce shipment status display; flight itinerary segmentation

## 1.13.1

### Patch Changes

- fixed bug with adjustment passenger name

## 1.13.0

### Minor Changes

- Update for public release of 2.0.0

### Patch Changes

- Updated dependencies
  - @versa/schema@2.0.0

## 1.12.5

### Patch Changes

- fix null-handling of adjustments and taxes; update receipt example

## 1.12.4

### Patch Changes

- patch versions with backwards compatible support for 2.0.0-rc3

## 1.12.3

### Patch Changes

- Patch updates for schema version 2.0.0-rc2
- Updated dependencies
  - @versa/schema@1.12.1

## 1.12.2

### Patch Changes

- fix display bugs with 2.0.0 receipts

## 1.12.1

### Patch Changes

- Bugfix: correctly organize passengers including metadata

## 1.12.0

### Minor Changes

- Preliminary Support for Versa Schema Version 2.0 (rc1)

### Patch Changes

- Updated dependencies
  - @versa/schema@1.12.0

## 1.11.1

### Patch Changes

- More reliable timezone support across pdf and react rendering

## 1.11.0

### Minor Changes

- Bump all downstream package versions to 1.11.0

## 1.10.1

### Patch Changes

- Updated dependencies
  - @versa/schema@1.11.0

## 1.10.0

### Minor Changes

- Update to schema_version 1.10.0

### Patch Changes

- Updated dependencies
  - @versa/schema@1.10.0

## 1.9.0

### Minor Changes

- Update to schema version 1.9, supporting taxes and fare on the flight ticket level

### Patch Changes

- Updated dependencies
  - @versa/schema@1.9.0

## 1.8.0

### Minor Changes

- Update to schema version 1.8.0; adding aircraft_type to flight segments

### Patch Changes

- Updated dependencies
  - @versa/schema@1.8.0

## 1.7.0

### Minor Changes

- Update for schema version 1.7.0

### Patch Changes

- Updated dependencies
  - @versa/schema@1.7.0

## 1.6.1

### Patch Changes

- Improvements to flight receipt organization and date formatting

## 1.6.0

### Minor Changes

- Update to schema version 1.6.0, with LTS support for 1.5.1

### Patch Changes

- Updated dependencies
  - @versa/schema@1.6.0

## 1.5.1

### Patch Changes

- Use the municipality instead of the airport code for itineray headings in flight receipts

## 1.5.0

### Minor Changes

- Update in accordance with schema version 1.5.1, accepting omitted keys as equivalent to null keys

### Patch Changes

- Updated dependencies
  - @versa/schema@1.5.0

## 1.4.0

### Minor Changes

- Update to 1.4; adding 'receipt_asset_id' and 'invoice_asset_id' to header

### Patch Changes

- Updated dependencies
  - @versa/schema@1.4.0

## 1.3.0

### Minor Changes

- Update to schema_version 1.3.0"

### Patch Changes

- Updated dependencies
  - @versa/schema@1.3.0

## 1.2.0

### Minor Changes

- Standardize timezones, replace receipt_id with invoice_number, rename item 'totals' to item.subtotal, other usability improvements

### Patch Changes

- Updated dependencies
  - @versa/schema@1.2.0

## 1.1.1

### Patch Changes

- Corrected the property name of a receipt's "schema_version" (expected "schema_version", not "version"
- Updated dependencies
  - @versa/schema@1.1.1

## 1.1.0

### Minor Changes

- Add departure_timezone and arrival_timezone to flights

### Patch Changes

- Updated dependencies
  - @versa/schema@1.1.0

## 1.0.3

### Patch Changes

- Fix flight passenger display organization
- Updated dependencies
  - @versa/schema@1.0.3

## 1.0.2

### Patch Changes

- Secondary update to padding bug
- Updated dependencies
  - @versa/schema@1.0.2

## 1.0.1

### Patch Changes

- 3454ab2: Bug fix: Unintended padding in flights with single passengers
- Updated dependencies [3454ab2]
  - @versa/schema@1.0.1

## 1.0.0

### Major Changes

- Bump official npm packages to first major version

### Patch Changes

- Updated dependencies
  - @versa/schema@1.0.0

## 0.3.0

### Minor Changes

- Add support for context-provided config

## 0.2.0

### Minor Changes

- Complete library of components
