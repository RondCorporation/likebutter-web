import type { Meta, StoryObj } from "@storybook/react";
import { ButtonContained } from ".";

const meta: Meta<typeof ButtonContained> = {
  title: "Components/ButtonContained",
  component: ButtonContained,

  argTypes: {
    type: {
      options: ["primary"],
      control: { type: "select" },
    },
    size: {
      options: ["large"],
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
    size: "large",
    icon: "none",
    stateProp: "hover",
    darkMode: true,
    className: {},
    textClassName: {},
  },
};
