import type { Meta, StoryObj } from "@storybook/react-vite";
import { findBait } from "~/lib/content";
import { BaitCard } from "./BaitCard";

const bait = findBait(3, 3)!;

const meta = { title: "Components/BaitCard", component: BaitCard, args: { bait } } satisfies Meta<typeof BaitCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OneLineSelected: Story = { args: { selection: { from: 1, to: 1 } } };
export const RangeSelected: Story = { args: { selection: { from: 1, to: 3 }, asliOpen: true } };
export const UsedInStories: Story = { args: { bait: findBait(3, 4)! } };
