import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from '@storybook/test';
import { ReceiptDisplay } from "@versaprotocol/react";
import { senders, receipts } from "examples";

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
    receipt: receipts.flightMultiple,
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
    receipt: receipts.carRental,
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
    merchant: senders.sonesta,
    receipt: receipts.ecommerce,
  },
};

export const Rail: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.rail,
  },
};

export const FoodDelivery: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.foodDelivery,
  },
};

export const FastFood: Story = {
  args: {
    merchant: senders.sonesta,
    receipt: receipts.fastFood,
  },
};
