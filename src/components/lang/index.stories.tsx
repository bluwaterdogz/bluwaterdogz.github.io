import { Meta, StoryFn } from "@storybook/react";
import { Lang } from "./";
import "./styles.module.scss";

export default {
  title: "Components/Lang",
  component: Lang,
  argTypes: {
    dark: { control: "boolean" },
  },
} as Meta;

const Template: StoryFn = (args) => <Lang {...args} />;

export const Default = Template.bind({});
Default.args = {
  dark: false,
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  dark: true,
};
