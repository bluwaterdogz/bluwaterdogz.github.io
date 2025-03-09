import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { MobileNav } from "./index";
import "./styles.module.scss";

export default {
  title: "Components/MobileNav",
  component: MobileNav,
  parameters: {
    backgrounds: {
      default: "Dark",
    },
  },

  argTypes: {
    open: { control: "boolean" },
  },
} as Meta;

const Template: StoryFn = (args) => {
  const [open, setOpen] = useState(args.open);
  return <MobileNav {...args} open={open} setOpen={setOpen} />;
};

export const Default = Template.bind({});
Default.args = {
  open: false,
};

export const Open = Template.bind({});
Open.args = {
  open: true,
};
