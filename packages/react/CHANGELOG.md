# @versaprotocol/react

## 1.12.2

### Patch Changes

- Updated dependencies
  - @versaprotocol/pdfgen@1.12.2

## 1.12.1

### Patch Changes

- Bugfix: correctly organize passengers including metadata
- Updated dependencies
  - @versaprotocol/belt@1.12.1
  - @versaprotocol/pdfgen@1.12.1

## 1.12.0

### Minor Changes

- Preliminary Support for Versa Schema Version 2.0 (rc1)

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.12.0
  - @versaprotocol/pdfgen@1.12.0
  - @versaprotocol/schema@1.12.0

## 1.11.13

### Patch Changes

- css fix

## 1.11.12

### Patch Changes

- add registry data modal

## 1.11.11

### Patch Changes

- Generalize advisory to expect strings, correct totals in our default flight json example
  - @versaprotocol/belt@1.11.1

## 1.11.10

### Patch Changes

- support an optional misuse object in the advisory"

## 1.11.9

### Patch Changes

- always attempt to render receipt data; rely on error boundaries/advisories"

## 1.11.8

### Patch Changes

- adding components for semantic validation; updated examples with v1 semval standards
  - @versaprotocol/belt@1.11.1

## 1.11.7

### Patch Changes

- Fix broken map display with partial location/address

## 1.11.6

### Patch Changes

- More reliable timezone support across pdf and react rendering
- Updated dependencies
  - @versaprotocol/belt@1.11.1
  - @versaprotocol/pdfgen@1.11.2

## 1.11.5

### Patch Changes

- Updated dependencies
  - @versaprotocol/pdfgen@1.11.1

## 1.11.4

### Patch Changes

- fixed edge-case behavior with schema version parsing; removed duplicate LTS check

## 1.11.3

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.11.0
  - @versaprotocol/pdfgen@1.11.0

## 1.11.2

### Patch Changes

- Add support for schema version 1.11.0; warn instead of break on newer schema versions
- Updated dependencies
  - @versaprotocol/schema@1.11.0
  - @versaprotocol/belt@1.10.1
  - @versaprotocol/pdfgen@1.10.1

## 1.11.1

### Patch Changes

- c4efcd4: Fix LTS compatibility and test compile

## 1.11.0

### Minor Changes

- Update to schema_version 1.10.0

### Patch Changes

- Updated dependencies
  - @versaprotocol/pdfgen@1.10.0
  - @versaprotocol/schema@1.10.0
  - @versaprotocol/belt@1.10.0

## 1.10.0

### Minor Changes

- Added ReceiptWithHistory component

## 1.9.3

### Patch Changes

- Correctly nest .npmignore in the dist directory to avoid publishing sourcemaps

## 1.9.4

### Patch Changes

- Try again

## 1.9.3

### Patch Changes

- Don't publish source maps to npm

## 1.9.2

### Patch Changes

- Reduce bundle size with terser

## 1.9.1

### Patch Changes

- Moved 'react' to peerDependencies explicitly, trimmed unused deps that were moved to pdfgen

## 1.9.0

### Minor Changes

- Update to schema version 1.9, fix fare display bug

## 1.8.8

### Patch Changes

- Updated dependencies
  - @versaprotocol/schema@1.9.0
  - @versaprotocol/belt@1.9.0
  - @versaprotocol/pdfgen@1.9.0

## 1.8.7

### Patch Changes

- Update to react 18.3

## 1.8.6

### Patch Changes

- Patch bug where pdf generation short circuits on an image fetch error, e.g. CSP violation
- Updated dependencies
  - @versaprotocol/pdfgen@1.8.9

## 1.8.1

### Patch Changes

- Fix typings

## 1.8.0

### Minor Changes

- Update to schema version 1.8.0; adding aircraft_type to flight segments

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.8.0
  - @versaprotocol/schema@1.8.0

## 1.7.2

### Patch Changes

- Minor UI improvements
  - @versaprotocol/belt@1.7.0

## 1.7.1

### Patch Changes

- Fix typings generation

## 1.7.0

### Minor Changes

- Update for schema version 1.7.0

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.7.0
  - @versaprotocol/schema@1.7.0

## 1.6.2

### Patch Changes

- Correctly flag 'react' as an external dependency

## 1.6.1

### Patch Changes

- Improvements to flight receipt organization and date formatting
- Updated dependencies
  - @versaprotocol/belt@1.6.1

## 1.6.0

### Minor Changes

- Update to schema version 1.6.0, with LTS support for 1.5.1

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.6.0
  - @versaprotocol/schema@1.6.0

## 1.5.1

### Patch Changes

- Use the municipality instead of the airport code for itineray headings in flight receipts
- Updated dependencies
  - @versaprotocol/belt@1.5.1

## 1.5.0

### Minor Changes

- Update in accordance with schema version 1.5.1, accepting omitted keys as equivalent to null keys

### Patch Changes

- Updated dependencies
  - @versaprotocol/schema@1.5.0
  - @versaprotocol/belt@1.5.0

## 1.4.1

### Patch Changes

- Link to the assets registry from Download Invoice/Receipt buttons

## 1.4.0

### Minor Changes

- Update to 1.4; adding 'receipt_asset_id' and 'invoice_asset_id' to header

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.4.0
  - @versaprotocol/schema@1.4.0

## 1.3.4

### Patch Changes

- Fix responsiveness of ReceiptDisplay

## 1.3.3

### Patch Changes

- Fix bug with lodging itemization component

## 1.3.2

### Patch Changes

- Update to schema_version 1.3.0"
- Updated dependencies
  - @versaprotocol/belt@1.3.0
  - @versaprotocol/schema@1.3.0

## 1.3.1

### Patch Changes

- Clean build of react lib

## 1.3.0

### Minor Changes

- Added full-page styles to receipt display

## 1.2.4

### Patch Changes

- explicitly ignore src files and package the dist directory

## 1.2.2

### Patch Changes

- Fixed defects in build process

## 1.2.1

### Patch Changes

- Fix any-typing in line item renderer that borked the display of itemized subtotals"

## 1.2.0

### Minor Changes

- Standardize timezones, replace receipt_id with invoice_number, rename item 'totals' to item.subtotal, other usability improvements

### Patch Changes

- Updated dependencies
  - @versaprotocol/schema@1.2.0
  - @versaprotocol/belt@1.2.0

## 1.1.1

### Patch Changes

- Corrected the property name of a receipt's "schema_version" (expected "schema_version", not "version"
- Updated dependencies
  - @versaprotocol/belt@1.1.1
  - @versaprotocol/schema@1.1.1

## 1.1.0

### Minor Changes

- Add departure_timezone and arrival_timezone to flights

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.1.0
  - @versaprotocol/schema@1.1.0

## 1.0.3

### Patch Changes

- Fix flight passenger display organization
- Updated dependencies
  - @versaprotocol/belt@1.0.3
  - @versaprotocol/schema@1.0.3

## 1.0.2

### Patch Changes

- Secondary update to padding bug
- Updated dependencies
  - @versaprotocol/belt@1.0.2
  - @versaprotocol/schema@1.0.2

## 1.0.1

### Patch Changes

- 3454ab2: Bug fix: Unintended padding in flights with single passengers
- Updated dependencies [3454ab2]
  - @versaprotocol/belt@1.0.1
  - @versaprotocol/schema@1.0.1

## 1.0.0

### Major Changes

- Bump official npm packages to first major version

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@1.0.0
  - @versaprotocol/schema@1.0.0

## 0.3.0

### Minor Changes

- Add support for context-provided config

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@0.3.0

## 0.2.0

### Minor Changes

- Complete library of components

### Patch Changes

- Updated dependencies
  - @versaprotocol/belt@0.2.0
