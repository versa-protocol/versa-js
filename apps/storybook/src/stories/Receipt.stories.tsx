import type { Meta, StoryObj } from "@storybook/react-webpack5";
// import { fn } from 'storybook/test';
import { ReceiptDisplay } from "@versa/react";
import { senders, receipts } from "@versa/examples";

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

export const Rail: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.rail,
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
