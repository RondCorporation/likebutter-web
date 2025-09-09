import type { Meta, StoryObj } from "@storybook/react";
import { TabItem } from ".";

const meta: Meta<typeof TabItem> = {
  title: "Components/TabItem",
  component: TabItem,

  argTypes: {
    state: {
      options: ["selected", "default"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TabItem>;

export const Default: Story = {
  args: {
    state: "selected",
    icon: true,
    darkMode: true,
    className: {},
    text: "Tab Name",
  },
};
