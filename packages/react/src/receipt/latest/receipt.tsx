import { Org, Receipt } from "@versa/schema";
import {
  ActionBlock,
  BlockWrap,
  ItemizedCarRental,
  ItemizedEcommerce,
  ItemizedFlight,
  ItemizedLodging,
  ItemizedSubscription,
  ItemizedTransitRoute,
  LineItems,
  LocalBusiness,
  ReceiptFooter,
  ReceiptHeader,
  SupplementalText,
  ThirdParty,
  Totals,
} from "../../receipt-blocks";
import { aggregateAdjustments, aggregateTaxes } from "@versa/belt";
import styles from "./../base_receipt.module.css";
import { Payments } from "../../receipt-blocks/payments";
import { Parties } from "../../receipt-blocks/parties/parties";
import { usePdfGen } from "../../hooks/usePdfGen";
import { RegistryData } from "../../model";

export function ReceiptLatest({
  receipt,
  schemaVersion: _schemaVersion,
  merchant,
  theme,
  registryData,
}: {
  receipt: Receipt;
  schemaVersion: string;
  merchant: Org;
  theme?: string;
  registryData?: RegistryData;
}) {
  const data = receipt;

  // Theming
  const colors = {
    brand: "",
    brandHighContrast: "",
    brandThemeLight: false,
  };
  if (
    data?.header?.third_party &&
    data?.header?.third_party.make_primary &&
    data?.header?.third_party.merchant?.brand_color
  ) {
    colors.brand = data?.header?.third_party.merchant.brand_color;
  } else {
    colors.brand = merchant?.brand_color || "#000000";
  }
  // Should the brand theme be light with dark text, or dark with light text?
  colors.brandThemeLight = brightnessByColor(colors.brand) > 190;
  // If the brand color is effectively black or white...
  if (
    brightnessByColor(colors.brand) < 40 ||
    brightnessByColor(colors.brand) > 215
  ) {
    colors.brandHighContrast = "var(--blue)";
  } else {
    colors.brandHighContrast = colors.brand;
  }

  const mapAttribution =
    data.itemization.lodging ||
    (data.itemization.transit_route &&
      data.itemization.transit_route.transit_route_items.length < 2)
      ? true
      : false;

  const { downloadReceipt } = usePdfGen({
    merchant: merchant,
    receipt: data,
    brandColor: colors.brand,
  });

  return (
    <div className={styles.receiptWrap}>
      {/* Header */}

      <ReceiptHeader
        merchant={merchant}
        header={data.header}
        brandColor={colors.brand}
      />

      {/* Itemization */}

      {data.header.third_party && !data.header.third_party.make_primary && (
        <BlockWrap>
          <ThirdParty
            third_party={data.header.third_party}
            merchant={merchant}
          />
        </BlockWrap>
      )}
      {data.itemization.subscription && (
        <>
          <BlockWrap>
            <ItemizedSubscription
              header={data.header}
              subscription={data.itemization.subscription}
            />
          </BlockWrap>
          <BlockWrap>
            <LineItems
              items={data.itemization.subscription.subscription_items}
              header={data.header}
            />
          </BlockWrap>
        </>
      )}
      {data.itemization.car_rental && (
        <>
          <BlockWrap>
            <ItemizedCarRental
              car_rental={data.itemization.car_rental}
              header={data.header}
            />
          </BlockWrap>
          <BlockWrap>
            <LineItems
              items={data.itemization.car_rental.items}
              header={data.header}
            />
          </BlockWrap>
        </>
      )}
      {data.itemization.ecommerce && (
        <ItemizedEcommerce
          data={data.itemization.ecommerce}
          header={data.header}
          brandColor={colors.brand}
        />
      )}
      {data.itemization.lodging && (
        <>
          <BlockWrap>
            <ItemizedLodging
              lodging={data.itemization.lodging}
              header={data.header}
              theme={theme}
            />
          </BlockWrap>
          {data.itemization.lodging.items &&
            data.itemization.lodging.items.length > 0 && (
              <BlockWrap>
                <LineItems
                  items={data.itemization.lodging.items}
                  header={data.header}
                />
              </BlockWrap>
            )}
        </>
      )}
      {data.itemization.flight && (
        <BlockWrap>
          <ItemizedFlight
            flight={data.itemization.flight}
            header={data.header}
          />
        </BlockWrap>
      )}
      {data.itemization.transit_route && (
        <BlockWrap>
          <ItemizedTransitRoute
            transit_route={data.itemization.transit_route}
            header={data.header}
            theme={theme}
          />
        </BlockWrap>
      )}
      {data.itemization.general && (
        <BlockWrap>
          <LineItems
            items={data.itemization.general.items}
            header={data.header}
          />
        </BlockWrap>
      )}

      {/* Totals: Taxes, Fees, Tip */}

      <BlockWrap>
        <Totals
          taxes={aggregateTaxes(data.itemization)}
          header={data.header}
          adjustments={aggregateAdjustments(data.itemization)}
          colors={colors}
        />
      </BlockWrap>

      {/* Actions */}

      {data.footer.actions && data.footer.actions.length > 0 && (
        <BlockWrap>
          <ActionBlock
            actions={data.footer.actions}
            brandTheme={colors.brand}
            brandThemeContrastLight={colors.brandThemeLight}
          />
        </BlockWrap>
      )}

      {/* Local Transaction */}

      {data.header.location?.address?.street_address && (
        <BlockWrap>
          <LocalBusiness
            location={data.header.location}
            theme={theme}
            brandColor={colors.brandHighContrast}
          />
        </BlockWrap>
      )}

      {/* Payments */}

      {data.payments && data.payments.length > 0 && (
        <BlockWrap>
          <Payments payments={data.payments} header={data.header} />
        </BlockWrap>
      )}

      {/* Parties */}

      {(data.header.customer || merchant.address) && (
        <div className={styles.fullPageHide}>
          <BlockWrap>
            <Parties customer={data.header.customer} merchant={merchant} />
          </BlockWrap>
        </div>
      )}

      {/* Supplemental Text */}
      {!!data.footer.supplemental_text && (
        <BlockWrap>
          <SupplementalText text={data.footer.supplemental_text} />
        </BlockWrap>
      )}

      {/* Download & Registry Data */}
      <ReceiptFooter
        receipt={data}
        mapAttribution={mapAttribution}
        downloadReceipt={downloadReceipt}
        registryData={registryData}
      />
    </div>
  );
}

function brightnessByColor(color: string) {
  let r = "",
    g = "",
    b = "";
  const hasFullSpec = color.length == 7;
  const m = color.substring(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
  if (m) {
    r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16).toString();
    g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16).toString();
    b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16).toString();
  }
  if (typeof r != "undefined") {
    return (Number(r) * 299 + Number(g) * 587 + Number(b) * 114) / 1000;
  }
  return 0;
}
