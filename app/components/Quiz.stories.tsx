import type { Meta, StoryObj } from "@storybook/react-vite";
import { Quiz } from "./Quiz";

const meta = { title: "Components/Quiz", component: Quiz } satisfies Meta<typeof Quiz>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
