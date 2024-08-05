import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@versaprotocol/react";

const meta = {
  title: "Example/Footer",
  component: Footer,
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    mapAttribution: false,
  },
};
