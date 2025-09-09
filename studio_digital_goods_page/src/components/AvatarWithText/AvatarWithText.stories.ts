import type { Meta, StoryObj } from "@storybook/react";
import { AvatarWithText } from ".";

const meta: Meta<typeof AvatarWithText> = {
  title: "Components/AvatarWithText",
  component: AvatarWithText,

  argTypes: {
    type: {
      options: ["forty"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AvatarWithText>;

export const Default: Story = {
  args: {
    type: "forty",
    className: {},
    avatarDivClassName: {},
    avatarOverlapGroupClassName: {},
    avatarText: "abc",
    avatarSizeImageTrueClassName: {},
    avatarImage: true,
    divClassName: {},
    text: "Jane Cooper",
    divClassNameOverride: {},
    text1: "jane.cooper@example.com",
  },
};
