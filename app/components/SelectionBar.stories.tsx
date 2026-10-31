import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectionBar } from "./SelectionBar";

const meta = {
  title: "Components/SelectionBar",
  component: SelectionBar,
  args: { onCopy: () => {}, onShare: () => {}, onClose: () => {} },
} satisfies Meta<typeof SelectionBar>;
export default meta;

export const Shown: StoryObj<typeof meta> = { args: { label: "1:3:3:1–3" } };
export const Hidden: StoryObj<typeof meta> = { args: { label: null } };
