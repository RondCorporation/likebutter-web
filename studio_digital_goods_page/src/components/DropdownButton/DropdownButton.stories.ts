import type { Meta, StoryObj } from "@storybook/react";
import { DropdownButton } from ".";

const meta: Meta<typeof DropdownButton> = {
  title: "Components/DropdownButton",
  component: DropdownButton,

  argTypes: {
    state: {
      options: ["default"],
      control: { type: "select" },
    },
    type: {
      options: ["default"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DropdownButton>;

export const Default: Story = {
  args: {
    state: "default",
    type: "default",
    darkMode: true,
    className: {},
    frameClassName: {},
    divClassName: {},
    text: "Options",
    heroiconsSolidChevronDown3Color: "white",
  },
};
