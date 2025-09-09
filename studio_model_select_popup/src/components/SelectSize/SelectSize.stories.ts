import type { Meta, StoryObj } from "@storybook/react";
import { SelectSize } from ".";

const meta: Meta<typeof SelectSize> = {
  title: "Components/SelectSize",
  component: SelectSize,

  argTypes: {
    state: {
      options: ["selected", "default"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectSize>;

export const Default: Story = {
  args: {
    state: "selected",
    darkMode: true,
    className: {},
    hasDiv: true,
  },
};
