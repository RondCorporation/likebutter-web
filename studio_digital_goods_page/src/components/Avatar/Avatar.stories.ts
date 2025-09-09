import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from ".";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,

  argTypes: {
    size: {
      options: ["thirty-eight"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    status: false,
    size: "thirty-eight",
    image: true,
    className: {},
    overlapGroupClassName: {},
    divClassName: {},
    text: "A",
    ellipse: "/img/ellipse-17-1.png",
  },
};
