import type { Meta, StoryObj } from "@storybook/react-vite";
import { stories } from "~/lib/content";
import { StoryCard } from "./StoryCard";

const meta = { title: "Components/StoryCard", component: StoryCard, args: { story: stories[0], index: 0 } } satisfies Meta<
  typeof StoryCard
>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
