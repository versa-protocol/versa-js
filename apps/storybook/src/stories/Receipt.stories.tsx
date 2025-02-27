import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from '@storybook/test';
import { ReceiptDisplay } from "@versaprotocol/react";
import { Receipt } from "@versaprotocol/schema";
import { senders, receipts } from "@versaprotocol/examples";

const packageRegisteredReceipt = (
  receipt: Receipt,
  transaction_event_index = 0
) => {
  return {
    registration: {
      receipt_id: "",
      transaction_id: "",
      registered_at: Math.floor(new Date().valueOf() / 1000),
      transaction_event_index,
    },
    receipt,
  };
};

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
    receipt: packageRegisteredReceipt(receipts.subscription),
  },
};

export const Flight: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: packageRegisteredReceipt(receipts.flight),
  },
};

export const Redeye: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: packageRegisteredReceipt(receipts.redeye),
  },
};
export const FlightMultileg: Story = {
  args: {
    merchant: senders.united_airlines,
    receipt: packageRegisteredReceipt(receipts.flight_multileg),
  },
};

export const Lodging: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: packageRegisteredReceipt(receipts.lodging),
  },
};

export const Car_Rental: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: packageRegisteredReceipt(receipts.car_rental),
  },
};

export const Rideshare: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: packageRegisteredReceipt(receipts.rideshare),
  },
};

export const Ecommerce: Story = {
  args: {
    merchant: senders.amazon,
    receipt: packageRegisteredReceipt(receipts.ecommerce),
  },
};

export const Rail: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: packageRegisteredReceipt(receipts.rail),
  },
};

const receiptPriorToShipment: Receipt = {
  ...receipts.ecommerce,
  itemization: {
    ...receipts.ecommerce.itemization,
    ecommerce: {
      ...receipts.ecommerce.itemization.ecommerce,
      invoice_level_line_items: [
        ...(receipts.ecommerce.itemization.ecommerce?.shipments[0].items || []),
      ],
      invoice_level_adjustments: [],
      shipments: [],
    },
  },
};
const receiptPriorToPayment: Receipt = {
  ...receiptPriorToShipment,
  itemization: {
    ...receiptPriorToShipment.itemization,
    ecommerce: {
      ...receiptPriorToShipment.itemization.ecommerce,
      invoice_level_line_items: [
        ...(receiptPriorToShipment.itemization.ecommerce
          ?.invoice_level_line_items || []),
      ],
      invoice_level_adjustments: [],
      shipments: [],
    },
  },
  payments: [],
};

export const EcommerceWithHistory: Story = {
  args: {
    merchant: senders.amazon,
    receipt: packageRegisteredReceipt(receipts.ecommerce, 2),
    history: [
      packageRegisteredReceipt(receiptPriorToShipment, 1),
      packageRegisteredReceipt(receiptPriorToPayment),
    ],
  },
};

/** LTS Stories */

import { v1_5_1 } from "@versaprotocol/examples";

export const Lts1_5_1_Flight: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: packageRegisteredReceipt(v1_5_1.flight as any),
  },
};

export const Lts1_5_1_Simple: Story = {
  args: {
    merchant: senders.bend,
    receipt: packageRegisteredReceipt(v1_5_1.simple as any),
  },
};

import { v1_6_0 } from "@versaprotocol/examples";

export const Lts1_6_0_Flight: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: packageRegisteredReceipt(v1_6_0.flight as any),
  },
};

export const Lts1_6_0_Simple: Story = {
  args: {
    merchant: senders.bend,
    receipt: packageRegisteredReceipt(v1_6_0.simple as any),
  },
};

import { v1_7_0 } from "@versaprotocol/examples";

export const Lts1_7_0_Flight: Story = {
  args: {
    merchant: senders.jetblue,
    receipt: packageRegisteredReceipt(v1_7_0.flight as any),
  },
};
