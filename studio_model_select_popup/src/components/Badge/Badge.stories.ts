import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from ".";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,

  argTypes: {
    type: {
      options: ["info"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    type: "info",
    filled: true,
    rounded: true,
    darkMode: true,
    className: {},
    divClassName: {},
    text: "Value",
  },
};
