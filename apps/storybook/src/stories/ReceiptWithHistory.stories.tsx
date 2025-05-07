import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from '@storybook/test';
import { ReceiptWithHistory } from "@versaprotocol/react";
import { Lodging, Receipt } from "@versaprotocol/schema";
import { senders, receipts } from "@versaprotocol/examples";

const packageRegisteredReceipt = (
  receipt: Receipt,
  transaction_event_index: number,
  timestamp = Math.floor(new Date().valueOf() / 1000)
) => {
  return {
    registration: {
      receipt_id: "",
      transaction_id: "",
      registered_at: timestamp,
      transaction_event_index,
      handles: {
        customer_email_domain: "versa.org",
      },
    },
    receipt,
  };
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ReceiptWithHistory> = {
  title: "receipt/ReceiptWithHistory",
  component: ReceiptWithHistory,
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
} satisfies Meta<typeof ReceiptWithHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    receipts: [
      packageRegisteredReceipt(receipts.ecommerce, 2, 1740685304),
      packageRegisteredReceipt(receiptPriorToShipment, 1, 1739885291),
      packageRegisteredReceipt(receiptPriorToPayment, 0, 1739685291),
    ],
  },
};

const lodgingPriorToCheckin: Receipt = {
  ...receipts.lodging,
  header: {
    ...receipts.lodging.header,
    paid: 0,
  },
  itemization: {
    ...receipts.lodging.itemization,
    lodging: {
      ...(receipts.lodging.itemization.lodging as Lodging),
      items: [],
    },
  },
};

export const LodgingWithHistory: Story = {
  args: {
    merchant: senders.ihg,
    receipts: [
      packageRegisteredReceipt(receipts.lodging, 1, 1740685304),
      packageRegisteredReceipt(lodgingPriorToCheckin, 0, 1739685291),
    ],
  },
};
