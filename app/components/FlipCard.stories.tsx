import type { Meta, StoryObj } from "@storybook/react-vite";
import { findBait } from "~/lib/content";
import { FlipCard } from "./FlipCard";

const meta = {
  title: "Components/FlipCard",
  component: FlipCard,
  args: { bait: findBait(3, 3)!, onToggle: () => {} },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlipCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Front: Story = { args: { flipped: false } };
export const Back: Story = { args: { flipped: true } };
