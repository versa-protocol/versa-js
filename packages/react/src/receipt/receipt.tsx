import { Merchant, Receipt } from "@versaprotocol/schema";
import {
  ActionBlock,
  ActivityBlock,
  Footer,
  ItemizedCarRental,
  ItemizedFlight,
  ItemizedLodging,
  ItemizedSubscription,
  ItemizedTransitRoute,
  LineItems,
  LocalBusiness,
  ReceiptHeader,
  Shipment,
  ThirdParty,
  Totals,
} from "./../receipt-blocks";
import {
  Activity,
  aggregateAdjustments,
  aggregateEcommerceItems,
  aggregateTaxes,
} from "@versaprotocol/belt";
import styles from "./base_receipt.module.css";
import { Payments } from "../receipt-blocks/payments";
import { Parties } from "../receipt-blocks/parties/parties";

export function ReceiptDisplay({
  receipt,
  merchant,
  theme,
  activities,
}: {
  merchant: Merchant;
  receipt: Receipt;
  theme?: string;
  activities?: Activity[];
}) {
  const data = receipt;

  // Theming
  const colors = {
    brand: "",
    brandHighContrast: "",
    brandThemeLight: false,
  };
  if (
    receipt?.header?.third_party &&
    receipt?.header?.third_party.make_primary &&
    receipt?.header?.third_party.merchant.brand_color
  ) {
    colors.brand = receipt?.header?.third_party.merchant.brand_color;
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

  return (
    <div className={styles.receiptWrap}>
      {/* Header */}

      <ReceiptHeader merchant={merchant} header={data.header} />

      {/* Itemization */}

      {data.header.third_party && !data.header.third_party.make_primary && (
        <ThirdParty third_party={data.header.third_party} merchant={merchant} />
      )}
      {data.itemization.subscription && (
        <>
          <ItemizedSubscription subscription={data.itemization.subscription} />
          <LineItems items={data.itemization.subscription.subscription_items} />
        </>
      )}
      {data.itemization.car_rental && (
        <>
          <ItemizedCarRental car_rental={data.itemization.car_rental} />
          <LineItems items={data.itemization.car_rental.items} />
        </>
      )}
      {data.itemization.ecommerce && (
        <>
          {data.itemization.ecommerce.shipments && (
            <Shipment
              data={data.itemization.ecommerce.shipments}
              brandColor={colors.brand}
            />
          )}
          <LineItems
            items={aggregateEcommerceItems(data.itemization.ecommerce)}
          />
        </>
      )}
      {data.itemization.lodging && (
        <>
          <ItemizedLodging data={data.itemization.lodging} theme={theme} />
          {data.itemization.lodging.lodging_items.map((item) => (
            <LineItems items={item.items} />
          ))}
        </>
      )}
      {data.itemization.flight && (
        <ItemizedFlight flight={data.itemization.flight} />
      )}
      {data.itemization.transit_route && (
        <ItemizedTransitRoute
          transit_route={data.itemization.transit_route}
          header={data.header}
          theme={theme}
        />
      )}
      {data.itemization.general && (
        <LineItems items={(data.itemization.general as any).line_items} />
      )}

      {/* Totals: Taxes, Fees, Tip */}

      <Totals
        taxes={aggregateTaxes(data.itemization)}
        header={receipt.header}
        adjustments={aggregateAdjustments(data.itemization)}
        colors={colors}
      />

      {/* Actions */}

      {data.actions && (
        <ActionBlock
          actions={data.actions}
          brandTheme={colors.brand}
          brandThemeContrastLight={colors.brandThemeLight}
        />
      )}

      {/* Local Transaction */}

      {data.header.location && (
        <LocalBusiness
          location={data.header.location}
          theme={theme}
          brandColor={colors.brandHighContrast}
        />
      )}

      {/* Payments */}

      {data.payments && (
        <Payments payments={data.payments} header={data.header} />
      )}

      {/* Parties */}

      {data.header.customer && <Parties header={data.header} />}

      {/* Activity */}

      {!!activities?.length && <ActivityBlock activities={activities} />}

      {/* Footer */}

      <Footer
        mapAttribution={
          data.itemization.lodging ||
          (data.itemization.transit_route &&
            data.itemization.transit_route.transit_route_items.length < 2)
            ? true
            : false
        }
      />
    </div>
  );
}

function brightnessByColor(color: string) {
  var r = "",
    g = "",
    b = "";
  const hasFullSpec = color.length == 7;
  var m = color.substring(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
  if (m) {
    var r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16).toString(),
      g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16).toString(),
      b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16).toString();
  }
  if (typeof r != "undefined") {
    return (Number(r) * 299 + Number(g) * 587 + Number(b) * 114) / 1000;
  }
  return 0;
}
