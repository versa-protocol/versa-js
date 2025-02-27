import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from '@storybook/test';
import { ReceiptWithHistory } from "@versaprotocol/react";
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
    receipt: packageRegisteredReceipt(receipts.ecommerce, 2),
    history: [
      packageRegisteredReceipt(receiptPriorToShipment, 1),
      packageRegisteredReceipt(receiptPriorToPayment),
    ],
  },
};
