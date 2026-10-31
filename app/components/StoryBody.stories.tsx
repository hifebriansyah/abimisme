import type { Meta, StoryObj } from "@storybook/react-vite";
import { stories } from "~/lib/content";
import { StoryBody } from "./StoryBody";

const meta = { title: "Components/StoryBody", component: StoryBody, args: { body: stories[0].body } } satisfies Meta<
  typeof StoryBody
>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
