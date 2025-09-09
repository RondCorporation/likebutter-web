import type { Meta, StoryObj } from "@storybook/react";
import { ItemsSideMenuDark } from ".";

const meta: Meta<typeof ItemsSideMenuDark> = {
  title: "Components/ItemsSideMenuDark",
  component: ItemsSideMenuDark,

  argTypes: {
    type: {
      options: ["my-account", "menu-item"],
      control: { type: "select" },
    },
    state: {
      options: ["selected", "default"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ItemsSideMenuDark>;

export const Default: Story = {
  args: {
    openItems: true,
    type: "my-account",
    state: "selected",
    collapse: true,
    customize: true,
    className: {},
  },
};
