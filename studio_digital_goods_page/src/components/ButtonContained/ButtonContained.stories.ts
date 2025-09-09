import type { Meta, StoryObj } from "@storybook/react";
import { ButtonContained } from ".";

const meta: Meta<typeof ButtonContained> = {
  title: "Components/ButtonContained",
  component: ButtonContained,

  argTypes: {
    type: {
      options: ["primary", "text", "secondary"],
      control: { type: "select" },
    },
    size: {
      options: ["medium"],
      control: { type: "select" },
    },
    icon: {
      options: ["none"],
      control: { type: "select" },
    },
    stateProp: {
      options: ["hover", "default"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonContained>;

export const Default: Story = {
  args: {
    text: "Button text",
    type: "primary",
    size: "medium",
    icon: "none",
    stateProp: "hover",
    darkMode: true,
    className: {},
    textClassName: {},
  },
};
