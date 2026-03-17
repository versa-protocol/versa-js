import type { Meta, StoryObj } from "@storybook/react-webpack5";
// import { fn } from 'storybook/test';
import { ReceiptDisplay } from "@versa/react";
import { senders, receipts } from "@versa/examples";
import type { Receipt } from "@versa/schema";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ReceiptDisplay> = {
  title: "receipt/ReceiptDisplay",
  component: ReceiptDisplay,
  decorators: [
    (Story) => (
      <div style={{ width: "480px" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof ReceiptDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Subscription: Story = {
  args: {
    merchant: senders.bend,
    receipt: receipts.subscription,
  },
};

export const Flight: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: receipts.flight,
  },
};

export const Redeye: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: receipts.redeye,
  },
};
export const FlightMultileg: Story = {
  args: {
    merchant: senders.united_airlines,
    receipt: receipts.flight_multileg,
  },
};

export const Lodging: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.lodging,
  },
};

export const Car_Rental: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.car_rental,
  },
};

export const Rideshare: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.rideshare,
  },
};

export const Ecommerce: Story = {
  args: {
    merchant: senders.amazon,
    receipt: receipts.ecommerce,
  },
};

export const Parking: Story = {
  args: {
    merchant: senders.the_parking_spot,
    receipt: receipts.parking,
  },
};

export const Rail: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.rail,
  },
};

/** Third Party Stories */

const KAYAK_FOR_BUSINESS = {
  name: "Kayak for Business",
  brand_color: "#FF690F",
  logo: "https://pbs.twimg.com/profile_images/1675128229877653505/iHmQRelR_400x400.png",
  legal_name: "KAYAK Software Corporation",
  website: "kayak.com/business",
  vat_number: null,
  address: {
    street_address: "7 Market St",
    city: "Stamford",
    region: "CT",
    country: "US",
    postal_code: "06902",
  },
};

const thirdPartyFlightReceipt: Receipt = {
  schema_version: "2.1.1",
  header: {
    invoice_number: "KB-2024-08172934",
    currency: "usd",
    total: 52340,
    subtotal: 45600,
    paid: 52340,
    invoiced_at: 1713295619,
    mcc: null,
    third_party: {
      relation: "platform",
      make_primary: true,
      merchant: {
        name: "Delta Air Lines",
        brand_color: "#003A70",
        legal_name: "Delta Air Lines, Inc.",
        logo: "https://pbs.twimg.com/profile_images/1275507788609880070/O1z2hVZv_400x400.jpg",
        website: "delta.com",
        vat_number: null,
        address: {
          street_address: "1030 Delta Blvd",
          city: "Atlanta",
          region: "GA",
          country: "US",
          postal_code: "30354",
        },
      },
    },
    customer: {
      name: "Sarah Chen",
      email: "sarah.chen@acmecorp.com",
      website: null,
      metadata: [],
    },
    location: null,
    receipt_asset_id: null,
    invoice_asset_id: null,
  },
  itemization: {
    general: null,
    lodging: null,
    ecommerce: null,
    car_rental: null,
    transit_route: null,
    subscription: null,
    flight: {
      tickets: [
        {
          taxes: [],
          segments: [
            {
              fare: 22800,
              departure_airport_code: "SFO",
              arrival_airport_code: "JFK",
              aircraft_type: "A321",
              departure_at: 1713196492,
              arrival_at: 1713214492,
              departure_tz: "America/Los_Angeles",
              arrival_tz: "America/New_York",
              flight_number: "DL586",
              class_of_service: "y",
              seat: "22A",
              taxes: [
                { amount: 1710, rate: 0.075, name: "US Transportation Tax" },
                {
                  amount: 560,
                  rate: null,
                  name: "US September 11th Security Fee",
                },
                {
                  amount: 450,
                  rate: null,
                  name: "US Passenger Facility Charge",
                },
                { amount: 400, rate: null, name: "US Flight Segment Tax" },
              ],
              adjustments: [],
              metadata: [],
            },
            {
              fare: 22800,
              departure_airport_code: "JFK",
              arrival_airport_code: "SFO",
              aircraft_type: "A321",
              departure_at: 1713900952,
              arrival_at: 1713918952,
              departure_tz: "America/New_York",
              arrival_tz: "America/Los_Angeles",
              flight_number: "DL455",
              class_of_service: "y",
              seat: "22F",
              taxes: [
                { amount: 1710, rate: 0.075, name: "US Transportation Tax" },
                {
                  amount: 560,
                  rate: null,
                  name: "US September 11th Security Fee",
                },
                {
                  amount: 450,
                  rate: null,
                  name: "US Passenger Facility Charge",
                },
                { amount: 400, rate: null, name: "US Flight Segment Tax" },
              ],
              adjustments: [],
              metadata: [],
            },
          ],
          number: "0062145839201",
          record_locator: "KBXF42",
          passenger: {
            first_name: "Sarah",
            last_name: "Chen",
            preferred_first_name: null,
            email: "sarah.chen@acmecorp.com",
            phone: null,
            metadata: [{ key: "SkyMiles #", value: "2847109365" }],
          },
        },
      ],
      itinerary_locator: "9938271650482",
      invoice_level_adjustments: [],
    },
  },
  footer: {
    actions: [],
    supplemental_text:
      "Booked via Kayak for Business. Fare rules and cancellation policies apply per Delta Air Lines terms.",
  },
  payments: [
    {
      amount: 52340,
      paid_at: 1713295619,
      payment_type: "card",
      card_payment: {
        last_four: "8821",
        network: "visa",
      },
      ach_payment: null,
    },
  ],
};

export const FlightThirdParty: Story = {
  args: {
    merchant: KAYAK_FOR_BUSINESS,
    receipt: thirdPartyFlightReceipt,
  },
};

/** LTS Stories */

const TEST_CHECKOUT = {
  schema_version: "1.11.0",
  receipt_id: "rct_5ed073abbf3a4b49a8c03191f87d8ffe",
  receipt_hash: "",
  transaction_id: "txn_5ed073abbf3a4b49a8c03191f87d8ffe",
  transaction_event_index: 0,
  registered_at: 1739221813,
  handles: {
    customer_email: "joe@acme.com",
  },
  sender: {
    org_id: "org_b6d073a9bf3a4c49a8c03191f87d8ee2",
    name: "Supplier Co.",
    legal_name: "Acme Corporation",
    brand_color: "#f0C14B",
    logo: "https://static.platform.co/image_url.png",
    website: "supplier.com",
  },
};

export const ReceiptWithRegistryData: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: receipts.flight,
    registryData: TEST_CHECKOUT,
  },
};

// Import the 1.11.0 flight receipt with passenger names
import flight_1_11_0 from "@versa/examples/receipts/1.11.0/flight.json";

export const Flight_1_11_0_WithPassenger: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: flight_1_11_0 as any,
  },
};

// Import the 1.11.0 flight receipt with passenger names
import subscription_1_11_0 from "@versa/examples/receipts/1.11.0/subscription.json";

export const Subscription_1_11_0: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: subscription_1_11_0 as any,
  },
};
