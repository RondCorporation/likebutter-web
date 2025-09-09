import type { Meta, StoryObj } from "@storybook/react";
import { InputTextArea } from ".";

const meta: Meta<typeof InputTextArea> = {
  title: "Components/InputTextArea",
  component: InputTextArea,

  argTypes: {
    status: {
      options: ["default"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputTextArea>;

export const Default: Story = {
  args: {
    labelText: "Label",
    placeholderText: "Value",
    icon: false,
    mandantory: false,
    label: true,
    status: "default",
    darkMode: true,
    className: {},
    inputTextAreaClassName: {},
    overlapGroupClassName: {},
    containerClassName: {},
    divClassName: {},
    resizerClassName: {},
  },
};
